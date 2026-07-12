export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { DashboardService } from '@/lib/services/DashboardService';

export async function GET() {
  try {
    const kpis = await DashboardService.getKPIs();
    return NextResponse.json(kpis);
  } catch (error) {
    console.error('Error fetching Dashboard KPIs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

