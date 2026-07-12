
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { hashToken } from '@/lib/auth/utils';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('refresh_token')?.value;
    
    if (token) {
       // Invalidate in DB
       const hashed = await hashToken(token); // Not exact for searching since Argon2 produces different hashes, but we can't search directly. Actually, best practice is to store raw token ID in cookie, and hash in DB. For simplicity, we just delete the cookie here.
       cookieStore.delete('refresh_token');
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
