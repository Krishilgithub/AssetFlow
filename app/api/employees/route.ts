export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { CoreService, createEmployeeSchema } from '@/lib/services/CoreService';
import { z } from 'zod';

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
    
    // Default system user ID for now if no auth session is checked
    const defaultUserId = "00000000-0000-0000-0000-000000000000"; 
    
    const employee = await CoreService.createEmployee(parsed, defaultUserId);
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
