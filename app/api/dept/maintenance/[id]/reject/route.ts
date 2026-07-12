export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { DepartmentHeadService } from '@/lib/services/DepartmentHeadService';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await DepartmentHeadService.rejectMaintenance(id, user.id, body.reason);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
