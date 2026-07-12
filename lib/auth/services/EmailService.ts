import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const EmailService = {
  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await transporter.sendMail({
        from: `"AssetFlow" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      console.log('Email sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },

  async sendVerificationOTP(email: string, otp: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Verify Your AssetFlow Account</h2>
        <p style="color: #555; font-size: 16px;">Hello,</p>
        <p style="color: #555; font-size: 16px;">Thank you for registering with AssetFlow. Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #fff; background-color: #000; border-radius: 8px; letter-spacing: 5px;">${otp}</span>
        </div>
        <p style="color: #777; font-size: 14px; text-align: center;">If you did not request this, please ignore this email.</p>
      </div>
    `;
    return this.sendEmail(email, 'AssetFlow - Email Verification OTP', html);
  },

  async sendWelcomeEmail(email: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Welcome to AssetFlow!</h2>
        <p style="color: #555; font-size: 16px;">Hi ${name},</p>
        <p style="color: #555; font-size: 16px;">Your account has been successfully verified and activated. You can now log in and start managing enterprise assets efficiently.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login-in" style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #fff; background-color: #000; text-decoration: none; border-radius: 8px;">Log In Now</a>
        </div>
      </div>
    `;
    return this.sendEmail(email, 'Welcome to AssetFlow!', html);
  },

  async sendForgotPasswordOTP(email: string, otp: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="color: #555; font-size: 16px;">Hello,</p>
        <p style="color: #555; font-size: 16px;">We received a request to reset your password. Use the following OTP to proceed. Valid for 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #fff; background-color: #000; border-radius: 8px; letter-spacing: 5px;">${otp}</span>
        </div>
      </div>
    `;
    return this.sendEmail(email, 'AssetFlow - Password Reset OTP', html);
  },

  async sendPasswordChanged(email: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Password Changed Successfully</h2>
        <p style="color: #555; font-size: 16px;">Hello,</p>
        <p style="color: #555; font-size: 16px;">Your AssetFlow account password has been changed successfully. If you did not perform this action, please contact your administrator immediately.</p>
      </div>
    `;
    return this.sendEmail(email, 'AssetFlow - Security Alert: Password Changed', html);
  },

  async sendAccountLocked(email: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #d9534f; text-align: center;">Account Locked</h2>
        <p style="color: #555; font-size: 16px;">Hello,</p>
        <p style="color: #555; font-size: 16px;">Due to multiple failed login attempts, your account has been temporarily locked for 15 minutes to protect your security.</p>
        <p style="color: #777; font-size: 14px; text-align: center;">Please try again later or reset your password if you forgot it.</p>
      </div>
    `;
    return this.sendEmail(email, 'AssetFlow - Account Temporarily Locked', html);
  },

  /**
   * Sent when an admin creates a new employee account.
   * Includes login credentials so the employee can sign in immediately.
   */
  async sendEmployeeWelcome(email: string, firstName: string, tempPassword: string) {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login-in`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; width: 40px; height: 40px; background: #000; border-radius: 8px; font-size: 24px; line-height: 40px; color: #fff; font-weight: 900;">✳</span>
          <h2 style="color: #111; margin-top: 12px;">You've been added to AssetFlow</h2>
        </div>
        <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
        <p style="color: #555; font-size: 16px;">Your administrator has created an AssetFlow account for you. Use the credentials below to sign in for the first time.</p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #777; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Your Credentials</p>
          <p style="margin: 0 0 4px; font-size: 15px; color: #333;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0; font-size: 15px; color: #333;"><strong>Temporary Password:</strong> <span style="font-family: monospace; font-size: 16px; background: #e0e0e0; padding: 2px 8px; border-radius: 4px;">${tempPassword}</span></p>
        </div>
        <p style="color: #d9534f; font-size: 13px;">⚠️ Please change your password after your first login.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${loginUrl}" style="display: inline-block; padding: 12px 28px; font-size: 15px; font-weight: bold; color: #fff; background-color: #000; text-decoration: none; border-radius: 8px;">Sign In to AssetFlow</a>
        </div>
        <p style="color: #aaa; font-size: 12px; text-align: center;">If you weren't expecting this email, please contact your administrator.</p>
      </div>
    `;
    return this.sendEmail(email, `You've been added to AssetFlow — Your Login Credentials`, html);
  },

  /**
   * Sent when an asset is allocated to an employee.
   */
  async sendAssetAllocated(email: string, firstName: string, assetName: string) {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/employee`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; width: 40px; height: 40px; background: #000; border-radius: 8px; font-size: 24px; line-height: 40px; color: #fff; font-weight: 900;">✳</span>
          <h2 style="color: #111; margin-top: 12px;">Asset Allocated to You</h2>
        </div>
        <p style="color: #555; font-size: 16px;">Hi ${firstName},</p>
        <p style="color: #555; font-size: 16px;">An administrator has allocated the following asset to you:</p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #111;">📦 ${assetName}</p>
        </div>
        <p style="color: #555; font-size: 14px;">You can view all your assigned assets in your employee dashboard.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 28px; font-size: 15px; font-weight: bold; color: #fff; background-color: #000; text-decoration: none; border-radius: 8px;">View My Assets</a>
        </div>
      </div>
    `;
    return this.sendEmail(email, `AssetFlow — ${assetName} has been allocated to you`, html);
  }
};

