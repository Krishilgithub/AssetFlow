import { prisma } from '@/lib/db';
import { z } from 'zod';
import * as argon2 from 'argon2';
import { EmailService } from '@/lib/auth/services/EmailService';
import { NotificationService } from '@/lib/services/NotificationService';

const uuidRegex = /^[0-9a-fA-F-]{36}$/;

export const createEmployeeSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.string().optional().default("Employee"),
  departmentId: z.string().regex(uuidRegex).optional(),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(1),
  managerId: z.string().regex(uuidRegex).optional(),
  locationId: z.string().regex(uuidRegex).optional(),
});

export class CoreService {
  /**
   * Employees / Users
   */
  static async getEmployees() {
    const users = await prisma.users.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        is_active: true,
        created_at: true,
        user_roles: {
          include: { roles: true }
        },
        user_departments: {
          include: { departments: true }
        },
        asset_allocations_asset_allocations_allocated_toTousers: { 
          where: { status: 'Active' },
          select: { id: true }
        }
      }
    });

    return users.map(user => {
      const primaryDept = user.user_departments.find(ud => ud.is_primary)?.departments?.name || 
                          user.user_departments[0]?.departments?.name || 'Unassigned';
      
      const role = user.user_roles[0]?.roles?.name || 'Employee';

      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        initials: `${user.first_name[0] || ''}${user.last_name[0] || ''}`,
        email: user.email,
        role,
        dept: primaryDept, // mapped to 'dept' for the frontend
        allocatedAssetsCount: user.asset_allocations_asset_allocations_allocated_toTousers?.length || 0,
        status: user.is_active ? 'Active' : 'Inactive',
        joinDate: user.created_at?.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
    });
  }

  static async createEmployee(data: z.infer<typeof createEmployeeSchema>, currentUserId?: string | null) {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + "A1!";
    const passwordHash = await argon2.hash(tempPassword);

    const newUser = await prisma.users.create({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password_hash: passwordHash,
        created_by: currentUserId || undefined
      }
    });

    // Assign Role
    let roleRecord = await prisma.roles.findUnique({ where: { name: data.role } });
    if (!roleRecord) {
      roleRecord = await prisma.roles.create({ data: { name: data.role } });
    }

    await prisma.user_roles.create({
      data: {
        user_id: newUser.id,
        role_id: roleRecord.id
      }
    });

    // Assign Department
    if (data.departmentId) {
      await prisma.user_departments.create({
        data: {
          user_id: newUser.id,
          department_id: data.departmentId,
          is_primary: true
        }
      });
    }

    await prisma.audit_logs.create({
      data: {
        table_name: 'users',
        record_id: newUser.id,
        action_type: 'INSERT',
        performed_by: currentUserId || undefined,
      }
    });

    // ── Fire email + in-app notification (non-blocking) ────────────────
    // We pass the plain-text tempPassword before it's hashed so the email
    // can include it for the employee's first login.
    Promise.all([
      EmailService.sendEmployeeWelcome(newUser.email, newUser.first_name, tempPassword),
      NotificationService.create(newUser.id, {
        title: 'Welcome to AssetFlow! 👋',
        message: `Hi ${newUser.first_name}, your account has been created by an administrator. You can now log in and explore your workspace.`,
        type: 'info',
      }),
    ]).catch((err) => console.error('[createEmployee] notification/email error:', err));

    return newUser;
  }

  static async updateEmployeeRole(employeeId: string, newRoleName: string, currentUserId?: string | null) {
    // Check if role exists, if not create it
    let roleRecord = await prisma.roles.findUnique({ where: { name: newRoleName } });
    if (!roleRecord) {
      roleRecord = await prisma.roles.create({ data: { name: newRoleName } });
    }

    // Find existing user_roles for this employee and delete them
    await prisma.user_roles.deleteMany({
      where: { user_id: employeeId }
    });

    // Create the new role for the employee
    await prisma.user_roles.create({
      data: {
        user_id: employeeId,
        role_id: roleRecord.id
      }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'user_roles',
        record_id: employeeId,
        action_type: 'UPDATE',
        performed_by: currentUserId || undefined,
        new_value: { new_role: newRoleName }
      }
    });

    return { success: true, role: newRoleName };
  }

  /**
   * Departments
   */
  static async getDepartments() {
    const departments = await prisma.departments.findMany({
      where: { is_deleted: false },
      include: {
        users_departments_manager_idTousers: {
          select: { first_name: true, last_name: true }
        },
        _count: {
          select: {
            assets: { where: { is_deleted: false } },
            user_departments: true,
          }
        }
      }
    });

    return departments.map(dept => {
      const manager = dept.users_departments_manager_idTousers;
      return {
        id: dept.id,
        name: dept.name,
        head: manager ? `${manager.first_name} ${manager.last_name}` : 'Unassigned',
        headInitials: manager ? `${manager.first_name[0]}${manager.last_name[0]}` : 'U',
        employeesCount: dept._count.user_departments,
        assetsCount: dept._count.assets,
        status: 'Active', // Mocked as active unless deleted
        createdDate: dept.created_at?.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
    });
  }

  static async createDepartment(data: z.infer<typeof createDepartmentSchema>, currentUserId?: string | null) {
    const dept = await prisma.departments.create({
      data: {
        name: data.name,
        manager_id: data.managerId,
        location_id: data.locationId,
        created_by: currentUserId
      }
    });

    await prisma.audit_logs.create({
      data: {
        table_name: 'departments',
        record_id: dept.id,
        action_type: 'INSERT',
        performed_by: currentUserId,
      }
    });

    return dept;
  }
}

