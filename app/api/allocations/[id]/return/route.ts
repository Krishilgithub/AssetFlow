export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { AssetService } from '@/lib/services/AssetService';
import { getAuthUser } from '@/lib/auth/getAuthUser';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    
    const user = await getAuthUser();
    await AssetService.returnAsset(id, user?.id || '00000000-0000-0000-0000-000000000001', body.condition);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error returning asset:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
