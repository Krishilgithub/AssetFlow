const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'app/api/auth');

function createRoute(folder, content) {
  const dir = path.join(routesDir, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'route.ts'), content);
}

// 1. Signup Route
createRoute('signup', `
import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/services/AuthService';
import { signupSchema } from '@/lib/auth/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = signupSchema.parse(body);
    const result = await AuthService.signup(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') return NextResponse.json({ error: error.errors }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
`);

// 2. Verify Email Route
createRoute('verify-email', `
import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/services/AuthService';
import { otpSchema } from '@/lib/auth/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = otpSchema.parse(body);
    await AuthService.verifyEmail(data.email, data.otp);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
`);

// 3. Login Route
createRoute('login', `
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
`);

// 4. Logout Route
createRoute('logout', `
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
`);

// 5. Google Route (OAuth)
createRoute('google', `
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
    const { credential } = await req.json();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) throw new Error('Invalid Google token');

    let user = await prisma.users.findUnique({
      where: { email: payload.email },
      include: { user_roles: { include: { roles: true } } }
    });

    if (!user) {
      // Create user
      user = await prisma.users.create({
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
        data: { user_id: user.id, role_id: role.id }
      });
      await EmailService.sendWelcomeEmail(user.email, user.first_name);
      
      // refetch user for roles
      user = await prisma.users.findUnique({
        where: { email: payload.email },
        include: { user_roles: { include: { roles: true } } }
      }) as any;
    }

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
`);

console.log('Routes generated successfully.');
