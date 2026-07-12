export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { EmployeeService, createTransferSchema } from '@/lib/services/EmployeeService';
import { z } from 'zod';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const data = await EmployeeService.getMyTransfers(user.id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const body = await req.json();
    const data = createTransferSchema.parse(body);
    const result = await EmployeeService.createTransfer(user.id, data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
