export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { AssetService, allocateAssetSchema } from '@/lib/services/AssetService';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth/getAuthUser';

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

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allocation = await AssetService.allocateAsset({
      ...parsed,
      allocatedById: user.id
    }, user.id);

    return NextResponse.json(allocation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error allocating asset:', error);
    if (error instanceof Error) {
      try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.code === 'CONFLICT_ALLOCATED') {
          return NextResponse.json(parsedError, { status: 409 });
        }
      } catch (e) {
        // Not a JSON error string
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
