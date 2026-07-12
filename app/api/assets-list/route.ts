export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const assets = await prisma.assets.findMany({
      where: { is_deleted: false },
      include: {
        asset_categories: { select: { name: true } },
        departments: { select: { name: true } },
        asset_allocations: {
          where: { status: 'Active' },
          include: { users_asset_allocations_allocated_toTousers: { select: { first_name: true, last_name: true } } },
          take: 1
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = assets.map(a => {
      const activeAllocation = a.asset_allocations?.[0];
      const custodianName = activeAllocation 
        ? `${activeAllocation.users_asset_allocations_allocated_toTousers.first_name} ${activeAllocation.users_asset_allocations_allocated_toTousers.last_name}` 
        : 'Unassigned';

      return {
        id: a.tag_number,
        name: a.name,
        category: a.asset_categories.name,
        custodian: custodianName,
        department: a.departments.name,
        purchasedDate: a.purchase_date ? new Date(a.purchase_date).toLocaleDateString() : 'N/A',
        warrantyExpiry: 'N/A', // Mock until added to schema
        status: a.status
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

