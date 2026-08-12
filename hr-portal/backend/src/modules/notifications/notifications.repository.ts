import { prisma } from '../../config/db';
import { paginateParams } from '../../shared/utils';

export class NotificationsRepository {
  async findMany(params: { page?: number; limit?: number; userId: string; isRead?: boolean }) {
    const { skip, take, page, limit } = paginateParams(params.page, params.limit);
    const where = {
      userId: params.userId,
      ...(params.isRead !== undefined ? { isRead: params.isRead } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.notification.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.notification.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  }

  async create(data: any) {
    return prisma.notification.create({ data });
  }

  async markAsRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  }

  async delete(id: string) {
    return prisma.notification.delete({ where: { id } });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }
}

export default new NotificationsRepository();
