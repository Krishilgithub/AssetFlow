export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { DepartmentHeadService } from '@/lib/services/DepartmentHeadService';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const { id } = await params;
    const result = await DepartmentHeadService.approveReturn(id, user.id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
