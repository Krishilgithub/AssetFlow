import { prisma } from '../db';
import { z } from 'zod';

export const createAuditSchema = z.object({
  name: z.string().min(1),
  scheduledDate: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  auditorId: z.string().uuid(),
});

export class AuditService {
  static async getAudits() {
    const audits = await prisma.asset_audits.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        departments: { select: { name: true } },
        users: { select: { first_name: true, last_name: true } },
        _count: { select: { asset_audit_items: true } }
      }
    });

    return audits.map(a => ({
      id: a.id,
      name: a.name,
      department: a.departments?.name || 'All',
      auditor: `${a.users.first_name} ${a.users.last_name}`,
      scheduledDate: a.start_date?.toLocaleDateString() || 'N/A',
      status: a.status, // Planned, In Progress, Completed
      itemsCount: a._count.asset_audit_items,
    }));
  }

  static async createAudit(data: z.infer<typeof createAuditSchema>, currentUserId?: string | null) {
    const audit = await prisma.asset_audits.create({
      data: {
        name: data.name,
        start_date: data.scheduledDate ? new Date(data.scheduledDate) : new Date(),
        department_id: data.departmentId,
        auditor_id: data.auditorId,
        status: 'Scheduled',
      }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'asset_audits',
        record_id: audit.id,
        action_type: 'CREATE',
        performed_by: currentUserId,
      }
    });

    return audit;
  }
}
