
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
