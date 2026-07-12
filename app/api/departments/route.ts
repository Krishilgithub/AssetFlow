export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { CoreService, createDepartmentSchema } from '@/lib/services/CoreService';
import { z } from 'zod';

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
    
    // Default system user ID for now if no auth session is checked
    const defaultUserId = "00000000-0000-0000-0000-000000000000"; 
    
    const department = await CoreService.createDepartment(parsed, defaultUserId);
    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
