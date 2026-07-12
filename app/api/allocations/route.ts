export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { AssetService, allocateAssetSchema } from '@/lib/services/AssetService';
import { z } from 'zod';

export async function GET() {
  try {
    const allocations = await AssetService.getAllocations();
    return NextResponse.json(allocations);
  } catch (error) {
    console.error('Error fetching allocations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = allocateAssetSchema.parse(body);

    const defaultUserId = "00000000-0000-0000-0000-000000000000"; 
    
    const allocation = await AssetService.allocateAsset(parsed, defaultUserId);

    return NextResponse.json(allocation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error allocating asset:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
