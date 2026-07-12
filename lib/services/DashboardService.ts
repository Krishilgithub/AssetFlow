import { prisma } from '../db';

export class DashboardService {
  /**
   * Retrieves high-level KPIs for the dashboard
   */
  static async getKPIs() {
    // We will query live data from the database
    const totalAssets = await prisma.assets.count({ where: { is_deleted: false } });
    const availableAssets = await prisma.assets.count({ where: { status: 'Available', is_deleted: false } });
    const allocatedAssets = await prisma.assets.count({ where: { status: 'Allocated', is_deleted: false } });
    
    // Maintenance today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const maintenanceToday = await prisma.asset_maintenances.count({
      where: {
        created_at: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Active Bookings
    const activeBookings = await prisma.resource_bookings.count({
      where: { status: 'Confirmed' },
    });

    // Pending Transfers
    const pendingTransfers = await prisma.asset_transfers.count({
      where: { status: 'Pending' },
    });

    // Upcoming Returns (Allocations expected to return in next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingReturns = await prisma.asset_allocations.count({
      where: {
        status: 'Active',
        expected_return_date: {
          gte: new Date(),
          lte: nextWeek,
        },
      },
    });

    return {
      totalAssets,
      availableAssets,
      allocatedAssets,
      maintenanceToday,
      activeBookings,
      pendingTransfers,
      upcomingReturns,
    };
  }

  /**
   * Retrieves recent activity logs
   */
  static async getRecentActivities(limit = 10) {
    const activities = await prisma.audit_logs.findMany({
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          }
        }
      }
    });

    return activities.map(activity => ({
      id: activity.id,
      user: activity.users ? `${activity.users.first_name} ${activity.users.last_name}` : 'System',
      action: `${activity.action_type} on ${activity.table_name}`,
      module: activity.table_name,
      time: activity.created_at ? new Date(activity.created_at).toLocaleString() : new Date().toLocaleString(),
    }));
  }

  /**
   * Chart Data: Asset Status Distribution
   */
  static async getAssetStatusData() {
    const counts = await prisma.assets.groupBy({
      by: ['status'],
      _count: true,
      where: { is_deleted: false },
    });

    const statusColors: Record<string, string> = {
      'Available': '#22c55e', // green-500
      'Allocated': '#3b82f6', // blue-500
      'Reserved': '#eab308', // yellow-500
      'Under Maintenance': '#ef4444', // red-500
      'Lost': '#737373', // neutral-500
      'Retired': '#a3a3a3', // neutral-400
      'Disposed': '#d4d4d4', // neutral-300
    };

    return counts.map(item => ({
      name: item.status,
      value: item._count,
      color: statusColors[item.status] || '#171717',
    }));
  }

  /**
   * Chart Data: Department Allocation
   */
  static async getDepartmentAllocationData() {
    const departments = await prisma.departments.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        name: true,
        _count: {
          select: { assets: { where: { status: 'Allocated', is_deleted: false } } }
        }
      }
    });

    return departments.map(dept => ({
      name: dept.name,
      value: dept._count.assets,
    })).sort((a, b) => b.value - a.value).slice(0, 6); // Top 6 departments
  }

  /**
   * Chart Data: Category Distribution
   */
  static async getAssetCategoryData() {
    const categories = await prisma.asset_categories.findMany({
      where: { is_deleted: false },
      select: {
        name: true,
        _count: {
          select: { assets: { where: { is_deleted: false } } }
        }
      }
    });

    const colors = ["#171717", "#404040", "#737373", "#a3a3a3", "#d4d4d4"];
    return categories
      .map((cat, i) => ({
        name: cat.name,
        value: cat._count.assets,
        color: colors[i % colors.length]
      }))
      .filter(cat => cat.value > 0)
      .sort((a, b) => b.value - a.value);
  }
}
