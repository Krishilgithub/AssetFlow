import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth/getAuthUser';

export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete in correct order to avoid foreign key constraints
    await prisma.$transaction([
      prisma.asset_allocations.deleteMany(),
      prisma.asset_audit_items.deleteMany(),
      prisma.asset_maintenances.deleteMany(),
      prisma.asset_transfers.deleteMany(),
      prisma.assets.deleteMany()
    ]);

    return NextResponse.json({ success: true, message: 'All asset data has been purged successfully.' });
  } catch (error) {
    console.error('Failed to purge asset data:', error);
    return NextResponse.json({ error: 'Failed to purge asset data' }, { status: 500 });
  }
}
