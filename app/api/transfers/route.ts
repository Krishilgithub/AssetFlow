export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { AssetService, transferAssetSchema } from '@/lib/services/AssetService';
import { z } from 'zod';

export async function GET() {
  try {
    const transfers = await AssetService.getTransfers();
    return NextResponse.json(transfers);
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = transferAssetSchema.parse(body);

    const defaultUserId = "00000000-0000-0000-0000-000000000000"; 
    
    const transfer = await AssetService.createTransfer(parsed, defaultUserId);

    return NextResponse.json(transfer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating transfer request:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
