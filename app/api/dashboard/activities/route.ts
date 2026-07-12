export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { DashboardService } from '@/lib/services/DashboardService';

export async function GET() {
  try {
    const activities = await DashboardService.getRecentActivities();
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching Dashboard activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

