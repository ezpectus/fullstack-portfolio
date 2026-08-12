import notificationsRepository from './notifications.repository';
import { AppError } from '../../middleware/errorHandler';

export class NotificationsService {
  async list(userId: string, query: { page: number; limit: number; isRead?: boolean }) {
    return notificationsRepository.findMany({ userId, ...query });
  }

  async getById(id: string) {
    const notif = await notificationsRepository.findById(id);
    if (!notif) throw new AppError('Notification not found', 404);
    return notif;
  }

  async create(data: any) {
    return notificationsRepository.create(data);
  }

  async markAsRead(id: string) {
    const notif = await notificationsRepository.findById(id);
    if (!notif) throw new AppError('Notification not found', 404);
    return notificationsRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    return notificationsRepository.markAllAsRead(userId);
  }

  async delete(id: string) {
    const notif = await notificationsRepository.findById(id);
    if (!notif) throw new AppError('Notification not found', 404);
    return notificationsRepository.delete(id);
  }

  async getUnreadCount(userId: string) {
    return notificationsRepository.getUnreadCount(userId);
  }
}

export default new NotificationsService();
