export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const departmentSchema = z.object({
  name: z.string().min(2),
  manager_id: z.string().uuid().optional().nullable(),
});

export async function GET() {
  try {
    const departments = await prisma.departments.findMany({
      where: { is_deleted: false },
      include: {
        users_departments_manager_idTousers: { select: { first_name: true, last_name: true } }, // manager
        _count: { select: { assets: true, user_departments: true } },
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = departments.map(d => ({
      id: d.id,
      name: d.name,
      head: d.users_departments_manager_idTousers ? `${d.users_departments_manager_idTousers.first_name} ${d.users_departments_manager_idTousers.last_name}` : 'Unassigned',
      headInitials: d.users_departments_manager_idTousers ? `${d.users_departments_manager_idTousers.first_name[0]}${d.users_departments_manager_idTousers.last_name[0]}` : 'U',
      employeesCount: d._count.user_departments,
      assetsCount: d._count.assets,
      status: 'Active',
      createdDate: d.created_at ? d.created_at.toLocaleDateString() : 'Unknown',
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = departmentSchema.parse(body);

    const department = await prisma.departments.create({
      data: {
        name: parsed.name,
        manager_id: parsed.manager_id,
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

