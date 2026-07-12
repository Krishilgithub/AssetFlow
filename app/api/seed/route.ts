import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let category = await prisma.asset_categories.findFirst();
    if (!category) {
      category = await prisma.asset_categories.create({
        data: {
          name: 'Default Category',
          description: 'System generated default category',
        },
      });
    }

    let location = await prisma.locations.findFirst();
    if (!location) {
      location = await prisma.locations.create({
        data: {
          name: 'Main HQ',
          address: '123 ERP Street',
          city: 'Techville',
        },
      });
    }

    return NextResponse.json({
      category_id: category.id,
      location_id: location.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
