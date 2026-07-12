import { NextResponse } from 'next/server';
import { CoreService } from '@/lib/services/CoreService';
import { getAuthUser } from '@/lib/auth/getAuthUser';
import { z } from 'zod';

const updateRoleSchema = z.object({
  role: z.string().min(1)
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();
    
    // Simple admin check based on role structure
    // Normally you would have a more robust permission check
    const isAdmin = user?.user_roles?.some((ur: any) => ur.roles?.name === 'Admin');
    
    if (!user || !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employeeId = id;
    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { role } = updateRoleSchema.parse(body);

    const result = await CoreService.updateEmployeeRole(employeeId, role, user.id);
    
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating employee role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
