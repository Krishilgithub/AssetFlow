import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const categories = await prisma.asset_categories.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        created_at: true,
        _count: {
          select: {
            assets: { where: { is_deleted: false } }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(categories.map(c => ({ ...c, assetsCount: c._count.assets })));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createCategorySchema.parse(body);
    
    const user = await getAuthUser();
    
    const category = await prisma.asset_categories.create({
      data: {
        name: parsed.name,
        description: parsed.description,
        created_by: user?.id || null
      }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'asset_categories',
        record_id: category.id,
        action_type: 'CREATE',
        performed_by: user?.id || null,
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
