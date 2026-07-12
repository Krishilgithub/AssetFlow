import { prisma } from '@/lib/db';
import { z } from 'zod';

export const createBookingSchema = z.object({
  resourceId: z.string().uuid(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  purpose: z.string().optional()
});

export const createMaintenanceSchema = z.object({
  assetId: z.string().uuid(),
  issueType: z.string(),
  priority: z.string(),
  description: z.string()
});

export const createTransferSchema = z.object({
  assetId: z.string().uuid(),
  transferTo: z.string(), // employee name or UUID
  departmentId: z.string().uuid(),
  reason: z.string()
});

export const returnAssetSchema = z.object({
  assetId: z.string().uuid(),
  reason: z.string(),
  condition: z.string(),
  notes: z.string().optional()
});

export class EmployeeService {
  static async getMyAssets(userId: string) {
    const allocations = await prisma.asset_allocations.findMany({
      where: {
        allocated_to: userId,
        status: 'Active'
      },
      include: {
        assets: {
          include: {
            asset_categories: true,
            departments: true
          }
        }
      },
      orderBy: { allocation_date: 'desc' }
    });

    return allocations.map(a => ({
      id: a.assets.id,
      tag: a.assets.tag_number,
      name: a.assets.name,
      category: a.assets.asset_categories.name,
      condition: a.assets.status,
      allocatedDate: new Date(a.allocation_date).toLocaleDateString(),
      warranty: 'N/A', // Mock until added to schema
      status: a.assets.status,
      allocationId: a.id
    }));
  }

  static async getMyBookings(userId: string) {
    const bookings = await prisma.resource_bookings.findMany({
      where: { booked_by: userId },
      include: { resources: true },
      orderBy: { created_at: 'desc' }
    });

    return bookings.map(b => ({
      id: b.id,
      resource: b.resources.name,
      date: new Date(b.start_time).toLocaleDateString(),
      startTime: new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(b.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      purpose: b.purpose || 'N/A',
      status: b.status
    }));
  }

  static async createBooking(userId: string, data: z.infer<typeof createBookingSchema>) {
    // Basic overlapping check logic should be here. For simplicity, just create.
    const start = new Date(`${data.date}T${data.startTime}`);
    const end = new Date(`${data.date}T${data.endTime}`);

    return prisma.resource_bookings.create({
      data: {
        resource_id: data.resourceId,
        booked_by: userId,
        start_time: start,
        end_time: end,
        purpose: data.purpose,
        status: 'Confirmed'
      }
    });
  }

  static async getMyMaintenance(userId: string) {
    const reqs = await prisma.asset_maintenances.findMany({
      where: { reported_by: userId },
      include: {
        assets: true,
        users_asset_maintenances_technician_idTousers: true
      },
      orderBy: { created_at: 'desc' }
    });

    return reqs.map(r => {
      const tech = r.users_asset_maintenances_technician_idTousers;
      return {
        id: r.id,
        assetId: r.asset_id,
        assetName: r.assets.name,
        issueType: r.issue_description,
        priority: 'Medium', // Priority isn't in DB yet, mock it
        status: r.status,
        createdOn: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A',
        technician: tech ? `${tech.first_name} ${tech.last_name}` : 'Unassigned'
      };
    });
  }

  static async createMaintenance(userId: string, data: z.infer<typeof createMaintenanceSchema>) {
    return prisma.asset_maintenances.create({
      data: {
        asset_id: data.assetId,
        reported_by: userId,
        issue_description: `${data.issueType} - ${data.description} (Priority: ${data.priority})`,
        status: 'Pending Approval'
      }
    });
  }

  static async getMyTransfers(userId: string) {
    const reqs = await prisma.asset_transfers.findMany({
      where: { requested_by: userId },
      include: {
        assets: true,
        departments_asset_transfers_from_department_idTodepartments: true
      },
      orderBy: { created_at: 'desc' }
    });

    return reqs.map(r => ({
      id: r.id,
      assetName: r.assets.name,
      transferTo: 'N/A', // TransferTo user is missing in DB schema, only department is tracked.
      department: r.departments_asset_transfers_from_department_idTodepartments.name,
      reason: r.notes || 'N/A',
      requestDate: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A',
      status: r.status
    }));
  }

  static async createTransfer(userId: string, data: z.infer<typeof createTransferSchema>) {
    const asset = await prisma.assets.findUnique({ where: { id: data.assetId } });
    if (!asset) throw new Error('Asset not found');

    return prisma.asset_transfers.create({
      data: {
        asset_id: data.assetId,
        requested_by: userId,
        from_department_id: asset.department_id,
        to_department_id: data.departmentId,
        notes: `Transfer to ${data.transferTo}. Reason: ${data.reason}`,
        status: 'Pending'
      }
    });
  }

  static async getMyReturns(userId: string) {
    // Returns are modeled as allocations with status "Return Pending" or "Returned"
    const allocations = await prisma.asset_allocations.findMany({
      where: {
        allocated_to: userId,
        status: { in: ['Return Pending', 'Returned', 'Rejected Return'] }
      },
      include: { assets: true },
      orderBy: { updated_at: 'desc' }
    });

    return allocations.map(a => {
      // Parse notes to get reason and condition
      let reason = 'N/A';
      let condition = 'N/A';
      if (a.notes) {
        const matchReason = a.notes.match(/Reason: (.*?),/);
        const matchCondition = a.notes.match(/Condition: (.*)/);
        if (matchReason) reason = matchReason[1];
        if (matchCondition) condition = matchCondition[1];
      }

      return {
        id: a.id,
        assetId: a.asset_id,
        assetName: a.assets.name,
        reason,
        condition,
        requestDate: a.updated_at ? new Date(a.updated_at).toLocaleDateString() : 'N/A',
        status: a.status === 'Return Pending' ? 'Pending' : a.status,
        approvedBy: a.status === 'Returned' ? 'Admin' : 'N/A'
      };
    });
  }

  static async returnAsset(userId: string, data: z.infer<typeof returnAssetSchema>) {
    // Find active allocation
    const allocation = await prisma.asset_allocations.findFirst({
      where: {
        asset_id: data.assetId,
        allocated_to: userId,
        status: 'Active'
      }
    });

    if (!allocation) throw new Error('No active allocation found for this asset');

    const notes = `Return Reason: ${data.reason}, Condition: ${data.condition}${data.notes ? `, Notes: ${data.notes}` : ''}`;

    return prisma.asset_allocations.update({
      where: { id: allocation.id },
      data: {
        status: 'Return Pending',
        notes
      }
    });
  }
}
