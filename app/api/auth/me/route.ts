
import { NextResponse } from 'next/server';
import { TokenService } from '@/lib/auth/services/TokenService';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const payload = TokenService.verifyAccessToken(token);
    
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    return NextResponse.json({ user: payload });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
