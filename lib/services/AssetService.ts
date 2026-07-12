import { prisma } from '../db';
import { z } from 'zod';
import { NotificationService } from '@/lib/services/NotificationService';

const uuidRegex = /^[0-9a-fA-F-]{36}$/;

export const createAssetSchema = z.object({
  name: z.string().min(1),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  assetTag: z.string().min(1),
  purchaseCost: z.coerce.number().optional(),
  purchaseDate: z.string().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
  categoryId: z.string().regex(uuidRegex, "Invalid UUID format"),
  departmentId: z.string().regex(uuidRegex, "Invalid UUID format"),
  locationId: z.string().regex(uuidRegex, "Invalid UUID format").optional(),
});

export const allocateAssetSchema = z.object({
  assetId: z.string().regex(uuidRegex, "Invalid UUID format"),
  allocatedToId: z.string().regex(uuidRegex, "Invalid UUID format"),
  allocatedById: z.string().regex(uuidRegex, "Invalid UUID format"),
  expectedReturnDate: z.string().optional(),
  notes: z.string().optional(),
});

export const transferAssetSchema = z.object({
  assetId: z.string().regex(uuidRegex, "Invalid UUID format"),
  fromDepartmentId: z.string().regex(uuidRegex, "Invalid UUID format"),
  toDepartmentId: z.string().regex(uuidRegex, "Invalid UUID format"),
  requestedById: z.string().regex(uuidRegex, "Invalid UUID format"),
  reason: z.string().optional(),
});

export class AssetService {
  /**
   * Assets
   */
  static async getAssets() {
    const assets = await prisma.assets.findMany({
      where: { is_deleted: false },
      include: {
        asset_categories: { select: { name: true } },
        departments: { select: { name: true } },
        locations: { select: { name: true } },
        asset_allocations: {
          where: { status: 'Active' },
          include: { users_asset_allocations_allocated_toTousers: { select: { first_name: true, last_name: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return assets.map(a => {
      const activeAllocation = a.asset_allocations[0];
      const assignedTo = activeAllocation ? `${activeAllocation.users_asset_allocations_allocated_toTousers.first_name} ${activeAllocation.users_asset_allocations_allocated_toTousers.last_name}` : 'Unassigned';

      return {
        id: a.id,
        name: a.name,
        category: a.asset_categories?.name || 'Uncategorized',
        assetTag: a.tag_number,
        serialNumber: a.serial_number || 'N/A',
        status: a.status, // Available, Allocated, Reserved, Under Maintenance, Lost, Retired
        department: a.departments?.name || 'Unassigned',
        location: a.locations?.name || 'Unassigned',
        assignedTo,
        custodian: assignedTo,
        allocationId: activeAllocation?.id || null,
        purchaseCost: a.purchase_cost ? Number(a.purchase_cost) : 0,
        purchaseDate: a.purchase_date?.toISOString().split('T')[0] || 'Unknown',
        warrantyExpiry: activeAllocation?.expected_return_date ? activeAllocation.expected_return_date.toLocaleDateString() : 'N/A',
      };
    });
  }

  static async createAsset(data: z.infer<typeof createAssetSchema>, currentUserId?: string | null) {
    // location_id is required by the DB; fall back to first available location
    let locationId = data.locationId;
    if (!locationId) {
      const firstLocation = await prisma.locations.findFirst({ where: { is_deleted: false }, select: { id: true } });
      locationId = firstLocation?.id;
    }
    if (!locationId) throw new Error('No location available. Please add a location first.');

    const asset = await prisma.assets.create({
      data: {
        name: data.name,
        serial_number: data.serialNumber,
        tag_number: data.assetTag,
        purchase_cost: data.purchaseCost,
        purchase_date: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        category_id: data.categoryId,
        department_id: data.departmentId,
        location_id: locationId,
        status: 'Available',
        created_by: currentUserId || undefined,
      }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'assets',
        record_id: asset.id,
        action_type: 'INSERT',
        performed_by: currentUserId || undefined,
      }
    });

    return asset;
  }

  /**
   * Allocations
   */
  static async getAllocations() {
    const allocations = await prisma.asset_allocations.findMany({
      orderBy: { allocation_date: 'desc' },
      include: {
        assets: { select: { name: true, tag_number: true } },
        users_asset_allocations_allocated_toTousers: { select: { first_name: true, last_name: true } },
        users_asset_allocations_allocated_byTousers: { select: { first_name: true, last_name: true } }
      }
    });

    return allocations.map(a => ({
      id: a.id,
      assetName: a.assets?.name,
      assetTag: a.assets?.tag_number,
      allocatedTo: `${a.users_asset_allocations_allocated_toTousers.first_name} ${a.users_asset_allocations_allocated_toTousers.last_name}`,
      allocatedBy: `${a.users_asset_allocations_allocated_byTousers.first_name} ${a.users_asset_allocations_allocated_byTousers.last_name}`,
      allocationDate: a.allocation_date.toLocaleDateString(),
      expectedReturn: a.expected_return_date?.toLocaleDateString() || 'N/A',
      returnDate: a.return_date?.toLocaleDateString() || null,
      status: a.status, // Active, Returned
      notes: a.notes,
    }));
  }

  static async allocateAsset(data: z.infer<typeof allocateAssetSchema>, currentUserId: string) {
    // Transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      const asset = await tx.assets.findUnique({ where: { id: data.assetId } });
      if (!asset) throw new Error("Asset not found");
      if (asset.status !== 'Available') {
        const activeAllocation = await tx.asset_allocations.findFirst({
          where: { asset_id: data.assetId, status: 'Active' },
          include: { users_asset_allocations_allocated_toTousers: { select: { first_name: true, last_name: true, id: true } } }
        });
        if (activeAllocation) {
          throw new Error(JSON.stringify({
            code: 'CONFLICT_ALLOCATED',
            message: `Asset is currently held by ${activeAllocation.users_asset_allocations_allocated_toTousers.first_name} ${activeAllocation.users_asset_allocations_allocated_toTousers.last_name}`,
            currentAssigneeId: activeAllocation.users_asset_allocations_allocated_toTousers.id,
            currentAssigneeName: `${activeAllocation.users_asset_allocations_allocated_toTousers.first_name} ${activeAllocation.users_asset_allocations_allocated_toTousers.last_name}`
          }));
        }
        throw new Error(`Asset is currently ${asset.status}`);
      }
      const allocation = await tx.asset_allocations.create({
        data: {
          asset_id: data.assetId,
          allocated_to: data.allocatedToId,
          allocated_by: data.allocatedById,
          expected_return_date: data.expectedReturnDate ? new Date(data.expectedReturnDate) : undefined,
          notes: data.notes,
          status: 'Active',
        }
      });

      await tx.assets.update({
        where: { id: data.assetId },
        data: { status: 'Allocated' }
      });

      await tx.audit_logs.create({
        data: {
          table_name: 'asset_allocations',
          record_id: allocation.id,
          action_type: 'INSERT',
          performed_by: currentUserId,
          new_value: { allocated_to: data.allocatedToId },
        }
      });

      return allocation;
    });

    // ── In-app notification to the employee (non-blocking) ───────────────
    Promise.resolve().then(async () => {
      try {
        const [asset, employee] = await Promise.all([
          prisma.assets.findUnique({ where: { id: data.assetId }, select: { name: true } }),
          prisma.users.findUnique({ where: { id: data.allocatedToId }, select: { first_name: true } }),
        ]);
        const assetName = asset?.name || 'an asset';
        const firstName = employee?.first_name || 'there';

        await NotificationService.create(data.allocatedToId, {
          title: `Asset Allocated: ${assetName}`,
          message: `Hi ${firstName}, the asset "${assetName}" has been allocated to you. You can view it under My Assets in your dashboard.`,
          type: 'info',
        });
      } catch (err) {
        console.error('[allocateAsset] notification error:', err);
      }
    });

    return result;
  }


  static async returnAsset(allocationId: string, currentUserId: string, condition?: string) {
    return prisma.$transaction(async (tx) => {
      const allocation = await tx.asset_allocations.findUnique({ where: { id: allocationId } });
      if (!allocation || allocation.status === 'Returned') throw new Error("Invalid allocation");

      await tx.asset_allocations.update({
        where: { id: allocationId },
        data: {
          status: 'Returned',
          return_date: new Date(),
        }
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
          performed_by: currentUserId,
          new_value: { status: 'Returned', condition },
        }
      });
      
      return true;
    });
  }

  /**
   * Transfers
   */
  static async getTransfers() {
    const transfers = await prisma.asset_transfers.findMany({
      orderBy: { transfer_date: 'desc' },
      include: {
        assets: { select: { name: true, tag_number: true } },
        departments_asset_transfers_from_department_idTodepartments: { select: { name: true } },
        departments_asset_transfers_to_department_idTodepartments: { select: { name: true } },
        users_asset_transfers_requested_byTousers: { select: { first_name: true, last_name: true } }
      }
    });

    return transfers.map(t => ({
      id: t.id,
      assetName: t.assets?.name,
      assetTag: t.assets?.tag_number,
      fromDept: t.departments_asset_transfers_from_department_idTodepartments?.name,
      toDept: t.departments_asset_transfers_to_department_idTodepartments?.name,
      requestedBy: `${t.users_asset_transfers_requested_byTousers.first_name} ${t.users_asset_transfers_requested_byTousers.last_name}`,
      requestDate: t.transfer_date?.toLocaleDateString() || 'N/A',
      status: t.status, // Pending, Approved, Rejected, Completed
      reason: t.notes,
    }));
  }

  static async createTransfer(data: z.infer<typeof transferAssetSchema>, currentUserId: string) {
    const transfer = await prisma.asset_transfers.create({
      data: {
        asset_id: data.assetId,
        from_department_id: data.fromDepartmentId,
        to_department_id: data.toDepartmentId,
        requested_by: data.requestedById, // or currentUserId
        status: 'Pending',
        notes: data.reason,
      }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'asset_transfers',
        record_id: transfer.id,
        action_type: 'INSERT',
        performed_by: currentUserId,
      }
    });

    return transfer;
  }
}
