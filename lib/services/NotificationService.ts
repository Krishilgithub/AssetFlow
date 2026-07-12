import { prisma } from '@/lib/db';

export class NotificationService {
  static async getForUser(userId: string) {
    const notifs = await prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50
    });

    return notifs.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,       // 'approval', 'rejection', 'info', 'alert'
      read: n.is_read ?? false,
      createdAt: n.created_at ? new Date(n.created_at).toLocaleString() : 'N/A',
      // Map type to a category the frontend filters by
      category: n.type.charAt(0).toUpperCase() + n.type.slice(1),
      priority: n.type === 'alert' ? 'High' : n.type === 'approval' ? 'Normal' : 'Low'
    }));
  }

  static async markAsRead(notificationId: string, userId: string) {
    // Security: only allow reading own notifications
    return prisma.notifications.updateMany({
      where: { id: notificationId, user_id: userId },
      data: { is_read: true }
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notifications.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true }
    });
  }

  static async deleteAll(userId: string) {
    return prisma.notifications.deleteMany({ where: { user_id: userId } });
  }

  /**
   * Create a notification for a specific user.
   * Called internally after approval/rejection events.
   */
  static async create(userId: string, {
    title,
    message,
    type = 'info'
  }: {
    title: string;
    message: string;
    type?: 'approval' | 'rejection' | 'info' | 'alert';
  }) {
    return prisma.notifications.create({
      data: { user_id: userId, title, message, type }
    });
  }

  /**
   * Batch notify multiple users
   */
  static async createMany(userIds: string[], payload: { title: string; message: string; type?: string }) {
    return prisma.notifications.createMany({
      data: userIds.map(uid => ({
        user_id: uid,
        title: payload.title,
        message: payload.message,
        type: payload.type || 'info'
      }))
    });
  }
}
