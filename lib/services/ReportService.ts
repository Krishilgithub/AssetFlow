import { prisma } from '@/lib/db';

type ReportFormat = 'assets' | 'allocations' | 'transfers' | 'maintenance';

function toCsv(rows: Record<string, any>[], headers: string[]): string {
  const escape = (v: any) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map(h => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

export class ReportService {
  static async generateCsv(format: ReportFormat, departmentId?: string): Promise<{ csv: string; filename: string }> {
    const now = new Date().toISOString().split('T')[0];

    if (format === 'assets') {
      const assets = await prisma.assets.findMany({
        where: { is_deleted: false, ...(departmentId ? { department_id: departmentId } : {}) },
        include: {
          asset_categories: { select: { name: true } },
          departments: { select: { name: true } },
          locations: { select: { name: true } },
          asset_allocations: {
            where: { status: 'Active' },
            include: { users_asset_allocations_allocated_toTousers: { select: { first_name: true, last_name: true } } },
            take: 1
          }
        },
        orderBy: { created_at: 'desc' }
      });

      const rows = assets.map(a => {
        const alloc = a.asset_allocations[0];
        const assignedTo = alloc
          ? `${alloc.users_asset_allocations_allocated_toTousers.first_name} ${alloc.users_asset_allocations_allocated_toTousers.last_name}`
          : 'Unassigned';
        return {
          id: a.id,
          name: a.name,
          tag_number: a.tag_number,
          serial_number: a.serial_number || '',
          category: a.asset_categories.name,
          department: a.departments?.name || '',
          location: a.locations?.name || '',
          status: a.status,
          assigned_to: assignedTo,
          purchase_cost: a.purchase_cost ? Number(a.purchase_cost) : 0,
          purchase_date: a.purchase_date?.toISOString().split('T')[0] || ''
        };
      });

      const headers = ['id', 'name', 'tag_number', 'serial_number', 'category', 'department', 'location', 'status', 'assigned_to', 'purchase_cost', 'purchase_date'];
      return { csv: toCsv(rows, headers), filename: `assets-report-${now}.csv` };
    }

    if (format === 'allocations') {
      const allocs = await prisma.asset_allocations.findMany({
        include: {
          assets: { select: { name: true, tag_number: true } },
          users_asset_allocations_allocated_toTousers: { select: { first_name: true, last_name: true } },
          users_asset_allocations_allocated_byTousers: { select: { first_name: true, last_name: true } }
        },
        orderBy: { allocation_date: 'desc' }
      });

      const rows = allocs.map(a => ({
        id: a.id,
        asset_name: a.assets.name,
        asset_tag: a.assets.tag_number,
        allocated_to: `${a.users_asset_allocations_allocated_toTousers.first_name} ${a.users_asset_allocations_allocated_toTousers.last_name}`,
        allocated_by: `${a.users_asset_allocations_allocated_byTousers.first_name} ${a.users_asset_allocations_allocated_byTousers.last_name}`,
        allocation_date: new Date(a.allocation_date).toISOString().split('T')[0],
        expected_return: a.expected_return_date?.toISOString().split('T')[0] || '',
        return_date: a.return_date?.toISOString().split('T')[0] || '',
        status: a.status,
        notes: a.notes || ''
      }));

      const headers = ['id', 'asset_name', 'asset_tag', 'allocated_to', 'allocated_by', 'allocation_date', 'expected_return', 'return_date', 'status', 'notes'];
      return { csv: toCsv(rows, headers), filename: `allocations-report-${now}.csv` };
    }

    if (format === 'transfers') {
      const transfers = await prisma.asset_transfers.findMany({
        include: {
          assets: { select: { name: true, tag_number: true } },
          departments_asset_transfers_from_department_idTodepartments: { select: { name: true } },
          departments_asset_transfers_to_department_idTodepartments: { select: { name: true } },
          users_asset_transfers_requested_byTousers: { select: { first_name: true, last_name: true } },
          users_asset_transfers_approved_byTousers: { select: { first_name: true, last_name: true } }
        },
        orderBy: { created_at: 'desc' }
      });

      const rows = transfers.map(t => ({
        id: t.id,
        asset_name: t.assets.name,
        asset_tag: t.assets.tag_number,
        from_department: t.departments_asset_transfers_from_department_idTodepartments.name,
        to_department: t.departments_asset_transfers_to_department_idTodepartments.name,
        requested_by: `${t.users_asset_transfers_requested_byTousers.first_name} ${t.users_asset_transfers_requested_byTousers.last_name}`,
        approved_by: t.users_asset_transfers_approved_byTousers
          ? `${t.users_asset_transfers_approved_byTousers.first_name} ${t.users_asset_transfers_approved_byTousers.last_name}`
          : '',
        status: t.status,
        transfer_date: t.transfer_date?.toISOString().split('T')[0] || '',
        notes: t.notes || ''
      }));

      const headers = ['id', 'asset_name', 'asset_tag', 'from_department', 'to_department', 'requested_by', 'approved_by', 'status', 'transfer_date', 'notes'];
      return { csv: toCsv(rows, headers), filename: `transfers-report-${now}.csv` };
    }

    if (format === 'maintenance') {
      const records = await prisma.asset_maintenances.findMany({
        include: {
          assets: { select: { name: true, tag_number: true } },
          users_asset_maintenances_reported_byTousers: { select: { first_name: true, last_name: true } },
          users_asset_maintenances_technician_idTousers: { select: { first_name: true, last_name: true } }
        },
        orderBy: { created_at: 'desc' }
      });

      const rows = records.map(r => ({
        id: r.id,
        asset_name: r.assets.name,
        asset_tag: r.assets.tag_number,
        reported_by: `${r.users_asset_maintenances_reported_byTousers.first_name} ${r.users_asset_maintenances_reported_byTousers.last_name}`,
        technician: r.users_asset_maintenances_technician_idTousers
          ? `${r.users_asset_maintenances_technician_idTousers.first_name} ${r.users_asset_maintenances_technician_idTousers.last_name}`
          : 'Unassigned',
        description: r.issue_description,
        status: r.status,
        cost: r.maintenance_cost ? Number(r.maintenance_cost) : 0,
        start_date: r.start_date?.toISOString().split('T')[0] || '',
        end_date: r.end_date?.toISOString().split('T')[0] || ''
      }));

      const headers = ['id', 'asset_name', 'asset_tag', 'reported_by', 'technician', 'description', 'status', 'cost', 'start_date', 'end_date'];
      return { csv: toCsv(rows, headers), filename: `maintenance-report-${now}.csv` };
    }

    throw new Error(`Unknown report format: ${format}`);
  }
}
