export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { OperationsService, createMaintenanceSchema } from '@/lib/services/OperationsService';
import { z } from 'zod';

export async function GET() {
  try {
    const records = await OperationsService.getMaintenanceRecords();
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createMaintenanceSchema.parse(body);

    const defaultUserId = "00000000-0000-0000-0000-000000000000"; 
    
    const record = await OperationsService.createMaintenance(parsed, defaultUserId);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error scheduling maintenance:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
