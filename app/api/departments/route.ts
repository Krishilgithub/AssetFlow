export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { CoreService, createDepartmentSchema } from '@/lib/services/CoreService';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth/getAuthUser';

export async function GET() {
  try {
    const departments = await CoreService.getDepartments();
    return NextResponse.json(departments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createDepartmentSchema.parse(body);
    
    const user = await getAuthUser();
    
    const department = await CoreService.createDepartment(parsed, user?.id || null);
    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
