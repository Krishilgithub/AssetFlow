import { prisma } from '../db';
import { z } from 'zod';

export const createAssetSchema = z.object({
  name: z.string().min(1),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  assetTag: z.string().min(1),
  purchaseCost: z.coerce.number().optional(),
  purchaseDate: z.string().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
  categoryId: z.string().uuid(),
  departmentId: z.string().uuid(),
  locationId: z.string().uuid().optional(),
});

export const allocateAssetSchema = z.object({
  assetId: z.string().uuid(),
  allocatedToId: z.string().uuid(),
  allocatedById: z.string().uuid(),
  expectedReturnDate: z.string().optional(),
  notes: z.string().optional(),
});

export const transferAssetSchema = z.object({
  assetId: z.string().uuid(),
  fromDepartmentId: z.string().uuid(),
  toDepartmentId: z.string().uuid(),
  requestedById: z.string().uuid(),
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
        purchaseCost: a.purchase_cost ? Number(a.purchase_cost) : 0,
        purchaseDate: a.purchase_date?.toISOString().split('T')[0] || 'Unknown',
      };
    });
  }

  static async createAsset(data: z.infer<typeof createAssetSchema>, currentUserId: string) {
    const asset = await prisma.assets.create({
      data: {
        name: data.name,
        serial_number: data.serialNumber,
        tag_number: data.assetTag,
        purchase_cost: data.purchaseCost,
        purchase_date: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        category_id: data.categoryId,
        department_id: data.departmentId,
        location_id: data.locationId || "22222222-2222-2222-2222-222222222222",
        status: 'Available',
        created_by: currentUserId,
      }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'assets',
        record_id: asset.id,
        action_type: 'CREATE',
        performed_by: currentUserId,
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
    return prisma.$transaction(async (tx) => {
      const asset = await tx.assets.findUnique({ where: { id: data.assetId } });
      if (!asset) throw new Error("Asset not found");
      if (asset.status !== 'Available') throw new Error(`Asset is currently ${asset.status}`);

      const allocation = await tx.asset_allocations.create({
        data: {
          asset_id: data.assetId,
          allocated_to: data.allocatedToId,
          allocated_by: data.allocatedById, // Use provided or currentUserId
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
          action_type: 'CREATE',
          performed_by: currentUserId,
          new_value: { allocated_to: data.allocatedToId },
        }
      });

      return allocation;
    });
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
        action_type: 'CREATE',
        performed_by: currentUserId,
      }
    });

    return transfer;
  }
}
