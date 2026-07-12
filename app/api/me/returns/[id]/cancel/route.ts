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

    const returnReq = await prisma.asset_allocations.findFirst({
      where: { id },
    });

    if (!returnReq) return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    if (returnReq.allocated_to !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updated = await prisma.asset_allocations.update({
      where: { id },
      data: { status: 'Active' }, // Cancel a return by changing it back to Active
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
