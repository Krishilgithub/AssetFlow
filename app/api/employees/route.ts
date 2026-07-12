export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { CoreService, createEmployeeSchema } from '@/lib/services/CoreService';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth/getAuthUser';

export async function GET() {
  try {
    const employees = await CoreService.getEmployees();
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createEmployeeSchema.parse(body);
    
    const user = await getAuthUser();
    const employee = await CoreService.createEmployee(parsed, user?.id || null);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
