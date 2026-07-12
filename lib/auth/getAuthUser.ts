import { cookies, headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { TokenService } from '@/lib/auth/services/TokenService';
import { NextResponse } from 'next/server';

export async function getAuthUser() {
  // 1. Try to authenticate via Authorization header (Bearer token)
  try {
    const headersStore = await headers();
    const authHeader = headersStore.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = TokenService.verifyAccessToken(token);
      if (payload) {
        const dbUser = await prisma.users.findUnique({
          where: { id: payload.userId },
          include: { user_roles: { include: { roles: true } } }
        });
        if (dbUser) {
          return dbUser;
        }
      }
    }
  } catch (error) {
    console.error('Error verifying bearer token in getAuthUser:', error);
  }

  // 1.5 Try to authenticate via assetflow_session cookie (JWT)
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('assetflow_session')?.value;
    if (sessionToken) {
      const payload = TokenService.verifyAccessToken(sessionToken);
      if (payload) {
        const dbUser = await prisma.users.findUnique({
          where: { id: payload.userId },
          include: { user_roles: { include: { roles: true } } }
        });
        if (dbUser) {
          return dbUser;
        }
      }
    }
  } catch (error) {
    console.error('Error verifying assetflow_session in getAuthUser:', error);
  }

  // 2. Fallback: Read refresh token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('refresh_token')?.value;

  if (token) {
    // Find the refresh token in the database
    const refreshTokenRecord = await prisma.refresh_tokens.findUnique({
      where: { token },
      include: { users: { include: { user_roles: { include: { roles: true } } } } }
    });

    if (refreshTokenRecord && !refreshTokenRecord.revoked && refreshTokenRecord.expires > new Date()) {
      return refreshTokenRecord.users;
    }
  }

  // 3. Fallback for local development/testing: Return the first Admin user to prevent local auth issues
  if (process.env.NODE_ENV !== 'production') {
    try {
      const devAdmin = await prisma.users.findFirst({
        where: {
          user_roles: {
            some: {
              roles: {
                name: 'Admin'
              }
            }
          }
        },
        include: { user_roles: { include: { roles: true } } }
      });
      if (devAdmin) {
        return devAdmin;
      }
    } catch (e) {
      console.error('Error finding dev admin fallback:', e);
    }
  }

  return null;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
