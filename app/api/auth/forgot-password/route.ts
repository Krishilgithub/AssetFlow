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

    const resetHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="color: #555; font-size: 16px;">Hello ${user.first_name},</p>
        <p style="color: #555; font-size: 16px;">You requested a password reset. Click the button below to reset your password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: #fff; background-color: #000; border-radius: 8px; text-decoration: none;">Reset Password</a>
        </div>
        <p style="color: #999; font-size: 13px; text-align: center;">If you did not request this, please ignore this email.</p>
      </div>
    `;

    await EmailService.sendEmail(email, 'AssetFlow – Password Reset Request', resetHtml);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Forgot Password error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
