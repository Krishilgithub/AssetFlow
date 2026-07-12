export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { DashboardService } from '@/lib/services/DashboardService';

export async function GET() {
  try {
    const statusData = await DashboardService.getAssetStatusData();
    const departmentAllocation = await DashboardService.getDepartmentAllocationData();
    const categoryData = await DashboardService.getAssetCategoryData();
    
    return NextResponse.json({
      statusData,
      departmentAllocation,
      categoryData,
    });
  } catch (error) {
    console.error('Error fetching Dashboard charts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

