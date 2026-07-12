
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
