import { prisma } from '../db';
import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  assetId: z.string().uuid(),
  description: z.string().min(1),
  scheduledDate: z.string().optional(),
  cost: z.coerce.number().optional(),
  performedById: z.string().uuid().optional(),
});

export const updateMaintenanceSchema = z.object({
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled']),
  completionDate: z.string().optional(),
  cost: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export const createBookingSchema = z.object({
  resourceId: z.string().uuid(),
  userId: z.string().uuid(),
  startTime: z.string(),
  endTime: z.string(),
  purpose: z.string().optional(),
});

export class OperationsService {
  /**
   * Maintenance
   */
  static async getMaintenanceRecords() {
    const records = await prisma.asset_maintenances.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        assets: { select: { name: true, tag_number: true } },
        users_asset_maintenances_reported_byTousers: { select: { first_name: true, last_name: true } }
      }
    });

    return records.map(m => ({
      id: m.id,
      assetName: m.assets?.name,
      assetTag: m.assets?.tag_number,
      description: m.issue_description,
      scheduledDate: m.start_date?.toLocaleDateString() || 'Unscheduled',
      completionDate: m.end_date?.toLocaleDateString() || 'N/A',
      cost: m.maintenance_cost ? Number(m.maintenance_cost) : 0,
      status: m.status, // Pending Approval, etc
      performedBy: m.users_asset_maintenances_reported_byTousers ? `${m.users_asset_maintenances_reported_byTousers.first_name} ${m.users_asset_maintenances_reported_byTousers.last_name}` : 'Unknown',
    }));
  }

  static async createMaintenance(data: z.infer<typeof createMaintenanceSchema>, currentUserId: string) {
    const record = await prisma.asset_maintenances.create({
      data: {
        asset_id: data.assetId,
        issue_description: data.description,
        start_date: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
        maintenance_cost: data.cost,
        reported_by: data.performedById || currentUserId,
        status: 'Scheduled',
      }
    });

    await prisma.assets.update({
      where: { id: data.assetId },
      data: { status: 'Under Maintenance' }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'asset_maintenances',
        record_id: record.id,
        action_type: 'INSERT',
        performed_by: currentUserId,
      }
    });

    return record;
  }

  static async updateMaintenance(id: string, data: z.infer<typeof updateMaintenanceSchema>, currentUserId: string) {
    return prisma.$transaction(async (tx) => {
      const maintenance = await tx.asset_maintenances.update({
        where: { id },
        data: {
          status: data.status,
          end_date: data.completionDate ? new Date(data.completionDate) : undefined,
          maintenance_cost: data.cost,
        }
      });

      if (data.status === 'Completed' || data.status === 'Cancelled') {
        await tx.assets.update({
          where: { id: maintenance.asset_id },
          data: { status: 'Available' } // Reset back to Available or previous state
        });
      }

      await tx.audit_logs.create({
        data: {
          table_name: 'asset_maintenances',
          record_id: maintenance.id,
          action_type: 'UPDATE',
          performed_by: currentUserId,
          new_value: { status: data.status },
        }
      });

      return maintenance;
    });
  }

  /**
   * Resource Bookings
   */
  static async getBookings() {
    const bookings = await prisma.resource_bookings.findMany({
      orderBy: { start_time: 'desc' },
      include: {
        resources: { select: { name: true } },
        users: { select: { first_name: true, last_name: true } }
      }
    });

    return bookings.map(b => ({
      id: b.id,
      resourceName: b.resources?.name,
      bookedBy: `${b.users?.first_name} ${b.users?.last_name}`,
      startTime: b.start_time.toLocaleString(),
      endTime: b.end_time.toLocaleString(),
      status: b.status, // Confirmed, Completed, Cancelled
      purpose: b.purpose,
    }));
  }

  static async createBooking(data: z.infer<typeof createBookingSchema>, currentUserId: string) {
    // Basic conflict checking could be added here
    const booking = await prisma.resource_bookings.create({
      data: {
        resource_id: data.resourceId,
        booked_by: data.userId,
        start_time: new Date(data.startTime),
        end_time: new Date(data.endTime),
        purpose: data.purpose,
        status: 'Confirmed',
      }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'resource_bookings',
        record_id: booking.id,
        action_type: 'INSERT',
        performed_by: currentUserId,
      }
    });

    return booking;
  }
}
