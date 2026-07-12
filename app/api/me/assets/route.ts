export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { EmployeeService } from '@/lib/services/EmployeeService';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const data = await EmployeeService.getMyAssets(user.id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
