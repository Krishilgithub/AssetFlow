import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword, generateOTP, hashToken, verifyToken } from '../utils';
import { EmailService } from './EmailService';
import { TokenService } from './TokenService';
import { addMinutes, addDays } from 'date-fns';

export class AuthService {
  static async getEmployeeRole() {
    let role = await prisma.roles.findFirst({ where: { name: 'Employee' } });
    if (!role) {
      role = await prisma.roles.create({
        data: { name: 'Employee', description: 'Standard employee role' }
      });
    }
    return role;
  }

  static async signup(data: any) {
    const existing = await prisma.users.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already exists');

    const hashedPassword = await hashPassword(data.password);
    
    // Create user as pending
    const user = await prisma.users.create({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password_hash: hashedPassword,
        is_active: false, // Pending verification
      },
    });

    const role = await this.getEmployeeRole();
    await prisma.user_roles.create({
      data: { user_id: user.id, role_id: role.id }
    });

    // Generate OTP
    const otp = generateOTP();
    const otpHash = await hashToken(otp);

    await prisma.email_verifications.create({
      data: {
        user_id: user.id,
        email: user.email,
        otp_hash: otpHash,
        expires: addMinutes(new Date(), 10),
      }
    });

    // Send Email
    await EmailService.sendVerificationOTP(user.email, otp);

    return { userId: user.id, email: user.email };
  }

  static async verifyEmail(email: string, otp: string) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const verification = await prisma.email_verifications.findUnique({ where: { user_id: user.id } });
    if (!verification) throw new Error('No pending verification');

    if (verification.attempts >= 5) {
      throw new Error('Too many attempts. Please request a new OTP.');
    }

    if (new Date() > verification.expires) {
      throw new Error('OTP expired');
    }

    const isValid = await verifyToken(verification.otp_hash, otp);
    if (!isValid) {
      await prisma.email_verifications.update({
        where: { id: verification.id },
        data: { attempts: verification.attempts + 1 }
      });
      throw new Error('Invalid OTP');
    }

    // Activate User
    await prisma.users.update({
      where: { id: user.id },
      data: { is_active: true }
    });

    // Cleanup OTP
    await prisma.email_verifications.delete({ where: { id: verification.id } });

    // Send Welcome Email
    await EmailService.sendWelcomeEmail(user.email, user.first_name);

    return true;
  }

  static async recordFailedLogin(email: string, ip: string) {
    const failed = await prisma.failed_logins.findUnique({ where: { email } });
    if (failed) {
      const count = failed.count + 1;
      let lockedUntil = null;
      if (count >= 5) {
        lockedUntil = addMinutes(new Date(), 15);
        await EmailService.sendAccountLocked(email);
      }
      await prisma.failed_logins.update({
        where: { email },
        data: { count, locked_until: lockedUntil }
      });
      return count >= 5 ? true : false;
    } else {
      await prisma.failed_logins.create({
        data: { email, ip_address: ip, count: 1 }
      });
      return false;
    }
  }

  static async clearFailedLogin(email: string) {
    await prisma.failed_logins.deleteMany({ where: { email } });
  }

  static async login(data: any, ip: string, userAgent: string) {
    const user = await prisma.users.findUnique({
      where: { email: data.email },
      include: { user_roles: { include: { roles: true } } }
    });
    if (!user) throw new Error('Invalid credentials');

    const failed = await prisma.failed_logins.findUnique({ where: { email: data.email } });
    if (failed && failed.locked_until && new Date() < failed.locked_until) {
      throw new Error('Account temporarily locked due to multiple failed login attempts.');
    }

    if (!user.is_active) throw new Error('Email not verified');

    const validPassword = await verifyPassword(user.password_hash, data.password);
    if (!validPassword) {
      await this.recordFailedLogin(data.email, ip);
      await prisma.login_history.create({
        data: { user_id: user.id, ip_address: ip, user_agent: userAgent, status: 'FAILED' }
      });
      throw new Error('Invalid credentials');
    }

    await this.clearFailedLogin(data.email);
    
    await prisma.login_history.create({
      data: { user_id: user.id, ip_address: ip, user_agent: userAgent, status: 'SUCCESS' }
    });

    const role = user.user_roles[0]?.roles?.name || 'Employee';
    const accessToken = TokenService.generateAccessToken({ userId: user.id, email: user.email, role });
    const refreshToken = TokenService.generateRefreshToken();

    const expires = addDays(new Date(), 7);
    await prisma.refresh_tokens.create({
      data: { user_id: user.id, token: await hashToken(refreshToken), expires }
    });

    return { user, accessToken, refreshToken, expires };
  }
}
