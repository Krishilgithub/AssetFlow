const fs = require('fs');
const path = require('path');

const routes = {
  // ── Notification routes for Employee/DeptHead ──
  'app/api/me/notifications/route.ts': `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { NotificationService } from '@/lib/services/NotificationService';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const data = await NotificationService.getForUser(user.id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    await NotificationService.deleteAll(user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,

  'app/api/me/notifications/read-all/route.ts': `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { NotificationService } from '@/lib/services/NotificationService';

export async function PATCH() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    await NotificationService.markAllAsRead(user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,

  'app/api/me/notifications/[id]/read/route.ts': `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { NotificationService } from '@/lib/services/NotificationService';

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    const { id } = await params;
    await NotificationService.markAsRead(id, user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,

  // ── CSV Export routes ──
  'app/api/reports/export/route.ts': `export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { ReportService } from '@/lib/services/ReportService';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();

    const url = new URL(req.url);
    const format = url.searchParams.get('format') as any;
    const deptId = url.searchParams.get('deptId') || undefined;

    if (!['assets', 'allocations', 'transfers', 'maintenance'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format. Use: assets|allocations|transfers|maintenance' }, { status: 400 });
    }

    const { csv, filename } = await ReportService.generateCsv(format, deptId);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': \`attachment; filename="\${filename}"\`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,
};

for (const [routePath, content] of Object.entries(routes)) {
  const fullPath = path.join(__dirname, routePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', fullPath);
}

console.log('\nAll Milestone 3 API routes generated!');
