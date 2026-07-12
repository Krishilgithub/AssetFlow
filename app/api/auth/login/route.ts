
import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/services/AuthService';
import { loginSchema } from '@/lib/auth/utils';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = loginSchema.parse(body);
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    const result = await AuthService.login(data, ip, userAgent);
    
    // Set HTTP Only Cookie for Refresh Token
    const cookieStore = await cookies();
    cookieStore.set('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: result.expires,
      path: '/'
    });

    // Set HTTP Only Cookie for Access Token
    cookieStore.set('assetflow_session', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    return NextResponse.json({
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        role: result.user.user_roles[0]?.roles?.name
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
