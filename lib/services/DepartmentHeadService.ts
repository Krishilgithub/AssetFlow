import { prisma } from '@/lib/db';
import { z } from 'zod';

export const approveTransferSchema = z.object({
  notes: z.string().optional()
});

export const rejectTransferSchema = z.object({
  reason: z.string().optional()
});

export const approveMaintenanceSchema = z.object({
  notes: z.string().optional()
});

export const rejectMaintenanceSchema = z.object({
  reason: z.string().optional()
});

export const approveReturnSchema = z.object({
  allocationId: z.string().uuid(),
  notes: z.string().optional()
});

export class DepartmentHeadService {
  /**
   * Get all assets belonging to a specific department
   */
  static async getDeptAssets(departmentId: string) {
    const assets = await prisma.assets.findMany({
      where: {
        department_id: departmentId,
        is_deleted: false
      },
      include: {
        asset_categories: { select: { name: true } },
        locations: { select: { name: true } },
        asset_allocations: {
          where: { status: 'Active' },
          include: {
            users_asset_allocations_allocated_toTousers: {
              select: { first_name: true, last_name: true }
            }
          },
          take: 1
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return assets.map(a => {
      const alloc = a.asset_allocations[0];
      const allocatedTo = alloc
        ? `${alloc.users_asset_allocations_allocated_toTousers.first_name} ${alloc.users_asset_allocations_allocated_toTousers.last_name}`
        : 'Unassigned';
      return {
        id: a.id,
        name: a.name,
        tag: a.tag_number,
        category: a.asset_categories.name,
        location: a.locations?.name || 'N/A',
        status: a.status,
        allocatedTo,
        purchaseCost: a.purchase_cost ? Number(a.purchase_cost) : 0,
        purchaseDate: a.purchase_date?.toISOString().split('T')[0] || 'Unknown'
      };
    });
  }

  /**
   * Get all employees in a department
   */
  static async getDeptEmployees(departmentId: string) {
    const userDepts = await prisma.user_departments.findMany({
      where: { department_id: departmentId },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            user_roles: { include: { roles: { select: { name: true } } } },
            asset_allocations_asset_allocations_allocated_toTousers: {
              where: { status: 'Active' },
              select: { id: true }
            }
          }
        }
      }
    });

    return userDepts.map(ud => ({
      id: ud.users.id,
      name: `${ud.users.first_name} ${ud.users.last_name}`,
      email: ud.users.email,
      role: ud.users.user_roles[0]?.roles?.name || 'Employee',
      assetsCount: ud.users.asset_allocations_asset_allocations_allocated_toTousers.length
    }));
  }

  /**
   * Get transfer requests for a department (incoming or outgoing)
   */
  static async getDeptTransfers(departmentId: string) {
    const transfers = await prisma.asset_transfers.findMany({
      where: {
        OR: [
          { from_department_id: departmentId },
          { to_department_id: departmentId }
        ]
      },
      include: {
        assets: { select: { name: true, tag_number: true } },
        departments_asset_transfers_from_department_idTodepartments: { select: { name: true } },
        departments_asset_transfers_to_department_idTodepartments: { select: { name: true } },
        users_asset_transfers_requested_byTousers: { select: { first_name: true, last_name: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    return transfers.map(t => ({
      id: t.id,
      assetName: t.assets.name,
      assetTag: t.assets.tag_number,
      fromDept: t.departments_asset_transfers_from_department_idTodepartments.name,
      toDept: t.departments_asset_transfers_to_department_idTodepartments.name,
      requestedBy: `${t.users_asset_transfers_requested_byTousers.first_name} ${t.users_asset_transfers_requested_byTousers.last_name}`,
      transferTo: t.notes?.match(/Transfer to (.*?)\./)?.[1] || 'N/A',
      requestDate: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'N/A',
      status: t.status,
      reason: t.notes || 'N/A'
    }));
  }

  /**
   * Approve a transfer request
   */
  static async approveTransfer(transferId: string, approverId: string, notes?: string) {
    return prisma.$transaction(async tx => {
      const transfer = await tx.asset_transfers.update({
        where: { id: transferId },
        data: {
          status: 'Approved',
          approved_by: approverId,
          transfer_date: new Date(),
          notes: notes ? `${notes}` : undefined
        }
      });

      // Move asset to new department
      await tx.assets.update({
        where: { id: transfer.asset_id },
        data: { department_id: transfer.to_department_id }
      });

      await tx.audit_logs.create({
        data: {
          table_name: 'asset_transfers',
          record_id: transferId,
          action_type: 'UPDATE',
          performed_by: approverId,
          new_value: { status: 'Approved' }
        }
      });

      return transfer;
    });
  }

  /**
   * Reject a transfer request
   */
  static async rejectTransfer(transferId: string, approverId: string, reason?: string) {
    return prisma.$transaction(async tx => {
      const transfer = await tx.asset_transfers.update({
        where: { id: transferId },
        data: {
          status: 'Rejected',
          approved_by: approverId
        }
      });

      await tx.audit_logs.create({
        data: {
          table_name: 'asset_transfers',
          record_id: transferId,
          action_type: 'UPDATE',
          performed_by: approverId,
          new_value: { status: 'Rejected', reason }
        }
      });

      return transfer;
    });
  }

  /**
   * Get maintenance requests for a department's assets
   */
  static async getDeptMaintenance(departmentId: string) {
    const records = await prisma.asset_maintenances.findMany({
      where: {
        assets: { department_id: departmentId }
      },
      include: {
        assets: { select: { name: true, tag_number: true } },
        users_asset_maintenances_reported_byTousers: { select: { first_name: true, last_name: true } },
        users_asset_maintenances_technician_idTousers: { select: { first_name: true, last_name: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    return records.map(r => {
      const reporter = r.users_asset_maintenances_reported_byTousers;
      const tech = r.users_asset_maintenances_technician_idTousers;
      return {
        id: r.id,
        assetId: r.asset_id,
        assetName: r.assets.name,
        assetTag: r.assets.tag_number,
        employee: `${reporter.first_name} ${reporter.last_name}`,
        issueType: r.issue_description,
        status: r.status,
        priority: 'Medium',
        createdOn: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A',
        technician: tech ? `${tech.first_name} ${tech.last_name}` : 'Unassigned'
      };
    });
  }

  /**
   * Approve maintenance (change status to 'In Progress')
   */
  static async approveMaintenance(maintenanceId: string, approverId: string) {
    return prisma.$transaction(async tx => {
      const record = await tx.asset_maintenances.update({
        where: { id: maintenanceId },
        data: { status: 'In Progress', technician_id: approverId }
      });

      await tx.audit_logs.create({
        data: {
          table_name: 'asset_maintenances',
          record_id: maintenanceId,
          action_type: 'UPDATE',
          performed_by: approverId,
          new_value: { status: 'In Progress' }
        }
      });

      return record;
    });
  }

  /**
   * Reject maintenance request
   */
  static async rejectMaintenance(maintenanceId: string, approverId: string, reason?: string) {
    return prisma.$transaction(async tx => {
      const record = await tx.asset_maintenances.update({
        where: { id: maintenanceId },
        data: { status: 'Cancelled' }
      });

      await tx.audit_logs.create({
        data: {
          table_name: 'asset_maintenances',
          record_id: maintenanceId,
          action_type: 'UPDATE',
          performed_by: approverId,
          new_value: { status: 'Cancelled', reason }
        }
      });

      return record;
    });
  }

  /**
   * Approve a pending asset return from an employee
   */
  static async approveReturn(allocationId: string, approverId: string) {
    return prisma.$transaction(async tx => {
      const allocation = await tx.asset_allocations.findUnique({ where: { id: allocationId } });
      if (!allocation) throw new Error('Allocation not found');

      await tx.asset_allocations.update({
        where: { id: allocationId },
        data: { status: 'Returned', return_date: new Date() }
      });

      await tx.assets.update({
        where: { id: allocation.asset_id },
        data: { status: 'Available' }
      });

      await tx.audit_logs.create({
        data: {
          table_name: 'asset_allocations',
          record_id: allocationId,
          action_type: 'UPDATE',
          performed_by: approverId,
          new_value: { status: 'Returned' }
        }
      });

      return allocation;
    });
  }

  /**
   * Get pending returns for a department
   */
  static async getDeptPendingReturns(departmentId: string) {
    const allocations = await prisma.asset_allocations.findMany({
      where: {
        status: 'Return Pending',
        assets: { department_id: departmentId }
      },
      include: {
        assets: { select: { name: true, tag_number: true } },
        users_asset_allocations_allocated_toTousers: { select: { first_name: true, last_name: true } }
      },
      orderBy: { updated_at: 'desc' }
    });

    return allocations.map(a => {
      const user = a.users_asset_allocations_allocated_toTousers;
      let reason = 'N/A';
      let condition = 'N/A';
      if (a.notes) {
        const matchReason = a.notes.match(/Return Reason: (.*?),/);
        const matchCondition = a.notes.match(/Condition: (.*?)(?:,|$)/);
        if (matchReason) reason = matchReason[1];
        if (matchCondition) condition = matchCondition[1];
      }
      return {
        id: a.id,
        assetId: a.asset_id,
        assetName: a.assets.name,
        assetTag: a.assets.tag_number,
        employee: `${user.first_name} ${user.last_name}`,
        reason,
        condition,
        requestDate: a.updated_at ? new Date(a.updated_at).toLocaleDateString() : 'N/A'
      };
    });
  }

  /**
   * Get dept-level bookings
   */
  static async getDeptBookings(departmentId: string) {
    // Get user IDs in this department first
    const deptUsers = await prisma.user_departments.findMany({
      where: { department_id: departmentId },
      select: { user_id: true }
    });

    const userIds = deptUsers.map(u => u.user_id);

    const bookings = await prisma.resource_bookings.findMany({
      where: { booked_by: { in: userIds } },
      include: {
        resources: true,
        users: { select: { first_name: true, last_name: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    return bookings.map(b => ({
      id: b.id,
      resource: b.resources.name,
      bookedBy: `${b.users.first_name} ${b.users.last_name}`,
      date: new Date(b.start_time).toLocaleDateString(),
      startTime: new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(b.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      purpose: b.purpose || 'N/A',
      status: b.status
    }));
  }

  /**
   * Get the department for the logged-in user (assuming they are a manager)
   */
  static async getManagerDepartment(userId: string) {
    const dept = await prisma.departments.findFirst({
      where: { manager_id: userId, is_deleted: false }
    });
    return dept;
  }

  /**
   * Dept overview stats
   */
  static async getDeptOverview(departmentId: string) {
    const [assets, employees, pendingTransfers, pendingMaint, pendingReturns] = await Promise.all([
      prisma.assets.count({ where: { department_id: departmentId, is_deleted: false } }),
      prisma.user_departments.count({ where: { department_id: departmentId } }),
      prisma.asset_transfers.count({
        where: {
          OR: [{ from_department_id: departmentId }, { to_department_id: departmentId }],
          status: 'Pending'
        }
      }),
      prisma.asset_maintenances.count({
        where: {
          assets: { department_id: departmentId },
          status: { in: ['Pending Approval', 'Scheduled'] }
        }
      }),
      prisma.asset_allocations.count({
        where: {
          status: 'Return Pending',
          assets: { department_id: departmentId }
        }
      })
    ]);

    return { assets, employees, pendingTransfers, pendingMaint, pendingReturns };
  }
}
