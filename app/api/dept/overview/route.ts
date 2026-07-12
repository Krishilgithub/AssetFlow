export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { DepartmentHeadService } from '@/lib/services/DepartmentHeadService';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();

    const dept = await DepartmentHeadService.getManagerDepartment(user.id);
    if (!dept) return NextResponse.json({ error: 'You are not managing any department' }, { status: 403 });

    const [overview, assets, employees, transfers, maintenance, returns, bookings] = await Promise.all([
      DepartmentHeadService.getDeptOverview(dept.id),
      DepartmentHeadService.getDeptAssets(dept.id),
      DepartmentHeadService.getDeptEmployees(dept.id),
      DepartmentHeadService.getDeptTransfers(dept.id),
      DepartmentHeadService.getDeptMaintenance(dept.id),
      DepartmentHeadService.getDeptPendingReturns(dept.id),
      DepartmentHeadService.getDeptBookings(dept.id)
    ]);

    return NextResponse.json({ dept, overview, assets, employees, transfers, maintenance, returns, bookings });
  } catch (error: any) {
    console.error('Dept overview error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
