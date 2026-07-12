import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as argon2 from 'argon2';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = resetPasswordSchema.parse(body);

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user || user.is_deleted || !user.is_active) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const resetToken = await prisma.password_reset_tokens.findUnique({
      where: { user_id: user.id }
    });

    if (!resetToken || resetToken.used || resetToken.expires < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Verify token hash
    const isValidToken = await argon2.verify(resetToken.token_hash, token);
    if (!isValidToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Update the password
    const newPasswordHash = await argon2.hash(newPassword);
    
    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: newPasswordHash }
    });

    // Mark token as used
    await prisma.password_reset_tokens.update({
      where: { id: resetToken.id },
      data: { used: true }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Reset Password error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
