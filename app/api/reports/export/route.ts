export const dynamic = 'force-dynamic';
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
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
