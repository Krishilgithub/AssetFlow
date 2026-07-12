import { prisma } from '../db';
import { z } from 'zod';
import * as argon2 from 'argon2';

export const createEmployeeSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.string().optional().default("Employee"),
  departmentId: z.string().uuid().optional(),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(1),
  managerId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
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
        initials: `${user.first_name[0]}${user.last_name[0]}`,
        email: user.email,
        role,
        department: primaryDept,
        status: user.is_active ? 'Active' : 'Inactive',
        joinDate: user.created_at?.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };
    });
  }

  static async createEmployee(data: z.infer<typeof createEmployeeSchema>, currentUserId: string) {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + "A1!";
    const passwordHash = await argon2.hash(tempPassword);

    const newUser = await prisma.users.create({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password_hash: passwordHash,
        created_by: currentUserId
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
        action_type: 'CREATE',
        performed_by: currentUserId,
      }
    });

    return newUser;
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

  static async createDepartment(data: z.infer<typeof createDepartmentSchema>, currentUserId: string) {
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
        action_type: 'CREATE',
        performed_by: currentUserId,
      }
    });

    return dept;
  }
}
