export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const assetSchema = z.object({
  name: z.string().min(2),
  tag_number: z.string(),
  serial_number: z.string().optional(),
  category_id: z.string().uuid(),
  department_id: z.string().uuid(),
  location_id: z.string().uuid(),
  status: z.enum(['Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed']).default('Available'),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const assets = await prisma.assets.findMany({
      where: { is_deleted: false },
      take: limit,
      include: {
        asset_categories: { select: { name: true } },
        departments: { select: { name: true } },
      },
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = assetSchema.parse(body);

    const asset = await prisma.assets.create({
      data: parsed,
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

