const fs = require('fs');
const path = require('path');

const routes = {
  assets: `export const dynamic = 'force-dynamic';
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
`,
  bookings: `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { EmployeeService, createBookingSchema } from '@/lib/services/EmployeeService';
import { z } from 'zod';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const data = await EmployeeService.getMyBookings(user.id);
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
    const data = createBookingSchema.parse(body);
    const result = await EmployeeService.createBooking(user.id, data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,
  maintenance: `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { EmployeeService, createMaintenanceSchema } from '@/lib/services/EmployeeService';
import { z } from 'zod';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const data = await EmployeeService.getMyMaintenance(user.id);
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
    const data = createMaintenanceSchema.parse(body);
    const result = await EmployeeService.createMaintenance(user.id, data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,
  transfers: `export const dynamic = 'force-dynamic';
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
`,
  returns: `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { EmployeeService, returnAssetSchema } from '@/lib/services/EmployeeService';
import { z } from 'zod';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const data = await EmployeeService.getMyReturns(user.id);
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
    const data = returnAssetSchema.parse(body);
    const result = await EmployeeService.returnAsset(user.id, data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`
};

for (const [key, content] of Object.entries(routes)) {
  fs.writeFileSync(path.join(__dirname, 'app/api/me', key, 'route.ts'), content);
}
console.log('Routes generated');
