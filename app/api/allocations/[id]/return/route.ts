export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { AssetService } from '@/lib/services/AssetService';
import { getAuthUser } from '@/lib/auth/getAuthUser';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await AssetService.returnAsset(id, user.id, body.condition);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error returning asset:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
