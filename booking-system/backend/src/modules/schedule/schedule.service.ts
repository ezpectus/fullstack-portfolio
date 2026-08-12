import { scheduleRepository } from './schedule.repository';
import { prisma } from '../../config/db';
import { NotFoundError } from '../../shared/errors';

export class ScheduleService {
  async getProviderSchedule(providerId: string, startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date(start);
    end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999);
    return scheduleRepository.getProviderSchedule(providerId, start, end);
  }

  async getAvailableSlots(providerId: string, date: string, serviceId: string) {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new NotFoundError('Service');
    const dateObj = new Date(date);
    return scheduleRepository.getAvailableSlots(providerId, dateObj, service.duration, 10);
  }

  async blockSlots(providerId: string, startDate: string, endDate: string, reason?: string) {
    return scheduleRepository.blockSlots(providerId, new Date(startDate), new Date(endDate), reason);
  }

  async unblockSlots(id: string) {
    return scheduleRepository.unblockSlots(id);
  }
}

export const scheduleService = new ScheduleService();
