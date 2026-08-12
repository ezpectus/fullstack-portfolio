import { prisma } from '../../config/db';
import { paginate, buildPageMeta } from '../../shared/pagination';

export class NotificationsRepository {
  async findMany(params: { userId: string; page: number; limit: number; isRead?: boolean }) {
    const where: any = { userId: params.userId };
    if (params.isRead !== undefined) where.isRead = params.isRead;
    const total = await prisma.notification.count({ where });
    const items = await prisma.notification.findMany({
      where,
      ...paginate(params.page, params.limit),
      orderBy: { createdAt: 'desc' },
    });
    return { items, meta: buildPageMeta(total, params.page, params.limit) };
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
