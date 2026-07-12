export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { NotificationService } from '@/lib/services/NotificationService';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json([]);
    const data = await NotificationService.getForUser(user.id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    await NotificationService.deleteAll(user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
