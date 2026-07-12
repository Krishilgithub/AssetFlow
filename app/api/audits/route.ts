export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { AuditService, createAuditSchema } from '@/lib/services/AuditService';
import { z } from 'zod';

export async function GET() {
  try {
    const audits = await AuditService.getAudits();
    return NextResponse.json(audits);
  } catch (error) {
    console.error('Error fetching audits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createAuditSchema.parse(body);

    const defaultUserId = "00000000-0000-0000-0000-000000000000"; 
    
    const audit = await AuditService.createAudit(parsed, defaultUserId);

    return NextResponse.json(audit, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating audit:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
