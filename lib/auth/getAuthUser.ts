import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('refresh_token')?.value;

  if (!token) {
    return null;
  }

  // Find the refresh token in the database
  const refreshTokenRecord = await prisma.refresh_tokens.findUnique({
    where: { token },
    include: { users: { include: { user_roles: { include: { roles: true } } } } }
  });

  if (!refreshTokenRecord || refreshTokenRecord.revoked || refreshTokenRecord.expires < new Date()) {
    return null;
  }

  return refreshTokenRecord.users;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
