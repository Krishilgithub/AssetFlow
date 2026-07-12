
import { NextResponse } from 'next/server';
import { TokenService } from '@/lib/auth/services/TokenService';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = TokenService.verifyAccessToken(token);
      
      if (payload) {
        const dbUser = await prisma.users.findUnique({
          where: { id: payload.userId },
          include: { user_roles: { include: { roles: true } } }
        });
        if (dbUser) {
          return NextResponse.json({
            user: {
              id: dbUser.id,
              email: dbUser.email,
              firstName: dbUser.first_name,
              lastName: dbUser.last_name,
              role: dbUser.user_roles[0]?.roles?.name || 'Employee'
            }
          });
        }
      }
    }

    // Fallback: Read refresh token from cookies using helper
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.user_roles[0]?.roles?.name || 'Employee'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
