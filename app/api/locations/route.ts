export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const locations = await prisma.locations.findMany({
      where: { is_deleted: false },
      select: { id: true, name: true, city: true, country: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
