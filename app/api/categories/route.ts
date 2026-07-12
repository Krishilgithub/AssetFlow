import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { z } from 'zod';

const customFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'number', 'date', 'boolean', 'textarea']),
  required: z.boolean().optional().default(false),
});

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  schema_definition: z.array(customFieldSchema).optional().default([]),
});

export async function GET() {
  try {
    const categories = await prisma.asset_categories.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        schema_definition: true,
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
        schema_definition: parsed.schema_definition,
        created_by: user?.id || null
      }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'asset_categories',
        record_id: category.id,
        action_type: 'INSERT',
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
    const parsed = createCategorySchema.partial().parse(data);

    const user = await getAuthUser();
    
    const category = await prisma.asset_categories.update({
      where: { id },
      data: {
        ...parsed,
        updated_by: user?.id || null
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
