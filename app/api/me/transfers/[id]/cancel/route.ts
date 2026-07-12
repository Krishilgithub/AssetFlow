import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AuthUser } from '@/lib/hooks/useDashboard';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('assetflow_session')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const transfer = await prisma.asset_transfers.findUnique({
      where: { id },
    });

    if (!transfer) return NextResponse.json({ error: 'Transfer not found' }, { status: 404 });
    if (transfer.requested_by !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updated = await prisma.asset_transfers.update({
      where: { id },
      data: { status: 'Cancelled' },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
