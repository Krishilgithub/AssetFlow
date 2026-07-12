
import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/db';
import { TokenService } from '@/lib/auth/services/TokenService';
import { EmailService } from '@/lib/auth/services/EmailService';
import { AuthService } from '@/lib/auth/services/AuthService';
import { hashToken } from '@/lib/auth/utils';
import { addDays } from 'date-fns';
import { cookies } from 'next/headers';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json(); // credential here is actually the access_token
    
    // Fetch user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${credential}` }
    });
    
    if (!userRes.ok) throw new Error('Failed to fetch user profile from Google');
    
    const payload = await userRes.json();
    if (!payload || !payload.email) throw new Error('Invalid Google user payload');

    let user = await prisma.users.findUnique({
      where: { email: payload.email },
      include: { user_roles: { include: { roles: true } } }
    });

    if (!user) {
      // Create user
      const newUser = await prisma.users.create({
        data: {
          email: payload.email,
          first_name: payload.given_name || 'Google',
          last_name: payload.family_name || 'User',
          password_hash: 'OAUTH_USER_NO_PASSWORD',
          is_active: true,
        }
      });
      const role = await AuthService.getEmployeeRole();
      await prisma.user_roles.create({
        data: { user_id: newUser.id, role_id: role.id }
      });
      await EmailService.sendWelcomeEmail(newUser.email, newUser.first_name);
      
      // refetch user for roles
      user = await prisma.users.findUnique({
        where: { email: payload.email },
        include: { user_roles: { include: { roles: true } } }
      }) as any;
    }
    
    if (!user) throw new Error('User not found or creation failed');

    const roleName = user.user_roles[0]?.roles?.name || 'Employee';
    const accessToken = TokenService.generateAccessToken({ userId: user.id, email: user.email, role: roleName });
    const refreshToken = TokenService.generateRefreshToken();

    await prisma.refresh_tokens.create({
      data: { user_id: user.id, token: await hashToken(refreshToken), expires: addDays(new Date(), 7) }
    });

    const cookieStore = await cookies();
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: addDays(new Date(), 7),
      path: '/'
    });

    return NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: roleName
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
