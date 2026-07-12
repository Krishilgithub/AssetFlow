export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { AssetService, createAssetSchema } from '@/lib/services/AssetService';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth/getAuthUser';

export async function GET(request: Request) {
  try {
    const assets = await AssetService.getAssets();
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createAssetSchema.parse(body);

    const user = await getAuthUser();
    const asset = await AssetService.createAsset(parsed, user?.id || null);

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

