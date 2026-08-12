import { prisma } from '../../config/db';
import { Prisma, BookingStatus } from '@prisma/client';

export class BookingsRepository {
  async findMany(params: { skip: number; limit: number; status?: string; providerId?: string; serviceId?: string; customerId?: string; startDate?: Date; endDate?: Date; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const where: Prisma.BookingWhereInput = {};
    if (params.status) where.status = params.status as BookingStatus;
    if (params.providerId) where.providerId = params.providerId;
    if (params.serviceId) where.serviceId = params.serviceId;
    if (params.customerId) where.customerId = params.customerId;
    if (params.startDate || params.endDate) {
      where.startTime = {};
      if (params.startDate) where.startTime.gte = params.startDate;
      if (params.endDate) where.startTime.lte = params.endDate;
    }
    if (params.search) {
      where.OR = [
        { bookingNumber: { contains: params.search, mode: 'insensitive' } },
        { customer: { name: { contains: params.search, mode: 'insensitive' } } },
      ];
    }
    const orderBy: Prisma.BookingOrderByWithRelationInput = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { startTime: 'desc' };
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({ where, skip: params.skip, take: params.limit, orderBy, include: { service: true, provider: { include: { user: { select: { name: true } } } }, customer: true } }),
      prisma.booking.count({ where }),
    ]);
    return { bookings, total };
  }

  async findById(id: string) {
    return prisma.booking.findUnique({ where: { id }, include: { service: true, provider: { include: { user: { select: { name: true, email: true } } } }, customer: true, notifications: true } });
  }

  async create(data: { bookingNumber: string; serviceId: string; providerId: string; customerId: string; startTime: Date; endTime: Date; price: number; notes?: string }) {
    return prisma.booking.create({ data, include: { service: true, provider: { include: { user: { select: { name: true } } } }, customer: true } });
  }

  async updateStatus(id: string, status: string, cancelReason?: string) {
    return prisma.booking.update({ where: { id }, data: { status: status as BookingStatus, cancelReason }, include: { service: true, provider: { include: { user: { select: { name: true } } } }, customer: true } });
  }

  async checkConflict(providerId: string, startTime: Date, endTime: Date, excludeBookingId?: string) {
    const where: Prisma.BookingWhereInput = {
      providerId,
      status: { notIn: ['CANCELLED', 'COMPLETED', 'NO_SHOW'] },
      OR: [
        { startTime: { gte: startTime, lt: endTime } },
        { endTime: { gt: startTime, lte: endTime } },
        { startTime: { lte: startTime }, endTime: { gte: endTime } },
      ],
    };
    if (excludeBookingId) where.id = { not: excludeBookingId };
    const count = await prisma.booking.count({ where });
    return count > 0;
  }

  async delete(id: string) {
    return prisma.booking.delete({ where: { id } });
  }
}

export const bookingsRepository = new BookingsRepository();
