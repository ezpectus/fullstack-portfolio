import { prisma } from '../../config/db';
import { Prisma, NotificationType, NotificationStatus } from '@prisma/client';

export class NotificationsRepository {
  async findMany(params: { skip: number; limit: number; status?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const where: Prisma.NotificationWhereInput = {};
    if (params.status) where.status = params.status as NotificationStatus;
    const orderBy: Prisma.NotificationOrderByWithRelationInput = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' };
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({ where, skip: params.skip, take: params.limit, orderBy, include: { booking: { include: { service: true, customer: true } } } }),
      prisma.notification.count({ where }),
    ]);
    return { notifications, total };
  }

  async create(data: { bookingId: string; type: string; status?: string }) {
    return prisma.notification.create({ data: { bookingId: data.bookingId, type: data.type as NotificationType, status: (data.status as NotificationStatus) || 'PENDING' } });
  }

  async updateStatus(id: string, status: string) {
    return prisma.notification.update({ where: { id }, data: { status: status as NotificationStatus, sentAt: status === 'SENT' ? new Date() : null } });
  }
}

export const notificationsRepository = new NotificationsRepository();
