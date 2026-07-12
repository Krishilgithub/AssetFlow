export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { OperationsService, createBookingSchema } from '@/lib/services/OperationsService';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { z } from 'zod';

export async function GET() {
  try {
    const records = await OperationsService.getBookings();
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createBookingSchema.parse(body);

    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const record = await OperationsService.createBooking(parsed, user.id);

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
