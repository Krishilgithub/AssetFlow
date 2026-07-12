export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAuthUser, unauthorizedResponse } from '@/lib/auth/getAuthUser';
import { NotificationService } from '@/lib/services/NotificationService';

export async function PATCH() {
  try {
    const user = await getAuthUser();
    if (!user) return unauthorizedResponse();
    await NotificationService.markAllAsRead(user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
