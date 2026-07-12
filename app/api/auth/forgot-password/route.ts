import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import { EmailService } from '@/lib/auth/services/EmailService';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user || user.is_deleted || !user.is_active) {
      // Do not reveal if the user exists or not
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = await argon2.hash(token);
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry

    // Delete any existing unused tokens for this user to prevent spam
    await prisma.password_reset_tokens.deleteMany({
      where: { user_id: user.id }
    });

    // Save the new token hash
    await prisma.password_reset_tokens.create({
      data: {
        user_id: user.id,
        token_hash: tokenHash,
        expires,
        used: false
      }
    });

    // Send the email with the raw token (not the hash)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    
    await EmailService.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      text: `Hello ${user.first_name},\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.first_name},</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 20px; color: #666;">If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Forgot Password error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
