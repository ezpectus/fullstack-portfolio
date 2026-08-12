import notificationsRepository from './notifications.repository';
import { NotFoundError, ForbiddenError } from '../../shared/errors';

export class NotificationsService {
  async list(userId: string, params: { page?: number; limit?: number; isRead?: boolean }) {
    return notificationsRepository.findMany({ ...params, userId });
  }

  async markAsRead(id: string, userId: string) {
    const notif = await notificationsRepository.findById(id);
    if (!notif) throw new NotFoundError('Notification');
    if (notif.userId !== userId) throw new ForbiddenError('Not allowed to access this notification');
    return notificationsRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    return notificationsRepository.markAllAsRead(userId);
  }

  async delete(id: string, userId: string) {
    const notif = await notificationsRepository.findById(id);
    if (!notif) throw new NotFoundError('Notification');
    if (notif.userId !== userId) throw new ForbiddenError('Not allowed to access this notification');
    return notificationsRepository.delete(id);
  }

  async getUnreadCount(userId: string) {
    return notificationsRepository.getUnreadCount(userId);
  }

  async create(data: { userId: string; type: string; title: string; message: string }) {
    return notificationsRepository.create(data);
  }
}

export default new NotificationsService();
