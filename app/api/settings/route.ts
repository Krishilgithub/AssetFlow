import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth/getAuthUser';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await prisma.organization_settings.findFirst();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.organization_settings.create({
        data: {}
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    let settings = await prisma.organization_settings.findFirst();
    if (!settings) {
      settings = await prisma.organization_settings.create({ data });
    } else {
      settings = await prisma.organization_settings.update({
        where: { id: settings.id },
        data: {
          org_name: data.org_name ?? settings.org_name,
          tax_id: data.tax_id ?? settings.tax_id,
          email: data.email ?? settings.email,
          address: data.address ?? settings.address,
          enable_email_alerts: data.enable_email_alerts ?? settings.enable_email_alerts,
          enable_audit_reminders: data.enable_audit_reminders ?? settings.enable_audit_reminders,
          enable_warranty_alerts: data.enable_warranty_alerts ?? settings.enable_warranty_alerts,
          min_password_length: data.min_password_length ?? settings.min_password_length,
          session_timeout: data.session_timeout ?? settings.session_timeout,
          backup_schedule: data.backup_schedule ?? settings.backup_schedule,
          updated_at: new Date()
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
