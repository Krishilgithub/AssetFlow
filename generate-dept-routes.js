const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'app/api/dept');

const routes = {
  'overview/route.ts': `export const dynamic = 'force-dynamic';
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
`,

  'transfers/[id]/approve/route.ts': `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { DepartmentHeadService } from '@/lib/services/DepartmentHeadService';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await DepartmentHeadService.approveTransfer(id, user.id, body.notes);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,

  'transfers/[id]/reject/route.ts': `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { DepartmentHeadService } from '@/lib/services/DepartmentHeadService';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const result = await DepartmentHeadService.rejectTransfer(id, user.id, body.reason);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,

  'maintenance/[id]/approve/route.ts': `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { DepartmentHeadService } from '@/lib/services/DepartmentHeadService';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const { id } = await params;
    const result = await DepartmentHeadService.approveMaintenance(id, user.id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,

  'maintenance/[id]/reject/route.ts': `export const dynamic = 'force-dynamic';
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
`,

  'returns/[id]/approve/route.ts': `export const dynamic = 'force-dynamic';
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
`
};

for (const [routePath, content] of Object.entries(routes)) {
  const fullPath = path.join(base, routePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', fullPath);
}

console.log('\\nAll dept API routes generated!');
