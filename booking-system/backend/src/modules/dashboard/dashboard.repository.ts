import { prisma } from '../../config/db';
import { BookingStatus } from '@prisma/client';

export class DashboardRepository {
  async getTodayBookings() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return prisma.booking.findMany({
      where: { startTime: { gte: start, lte: end }, status: { notIn: ['CANCELLED'] } },
      include: { service: true, provider: { include: { user: { select: { name: true } } } }, customer: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async getWeekBookings() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return prisma.booking.findMany({
      where: { startTime: { gte: start, lte: end }, status: { notIn: ['CANCELLED'] } },
      include: { service: true, provider: { include: { user: { select: { name: true } } } }, customer: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async getRevenue(startDate: Date, endDate: Date) {
    const result = await prisma.booking.aggregate({
      where: { status: 'COMPLETED', startTime: { gte: startDate, lte: endDate } },
      _sum: { price: true },
      _count: true,
    });
    return { total: result._sum.price || 0, count: result._count };
  }

  async getTopServices(limit: number) {
    const bookings = await prisma.booking.groupBy({
      by: ['serviceId'],
      where: { status: { notIn: ['CANCELLED'] } },
      _count: true,
      _sum: { price: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: limit,
    });
    const serviceIds = bookings.map((b) => b.serviceId);
    const services = await prisma.service.findMany({ where: { id: { in: serviceIds } } });
    return bookings.map((b) => ({
      service: services.find((s) => s.id === b.serviceId),
      count: b._count,
      revenue: b._sum.price || 0,
    }));
  }

  async getTopProviders(limit: number) {
    const bookings = await prisma.booking.groupBy({
      by: ['providerId'],
      where: { status: { notIn: ['CANCELLED'] } },
      _count: true,
      _sum: { price: true },
      orderBy: { _count: { providerId: 'desc' } },
      take: limit,
    });
    const providerIds = bookings.map((b) => b.providerId);
    const providers = await prisma.provider.findMany({
      where: { id: { in: providerIds } },
      include: { user: { select: { name: true } } },
    });
    return bookings.map((b) => ({
      provider: providers.find((p) => p.id === b.providerId),
      count: b._count,
      revenue: b._sum.price || 0,
    }));
  }

  async getNoShowRate() {
    const total = await prisma.booking.count({ where: { status: { in: ['COMPLETED', 'NO_SHOW'] } } });
    if (total === 0) return 0;
    const noShows = await prisma.booking.count({ where: { status: 'NO_SHOW' } });
    return (noShows / total) * 100;
  }

  async getProviderUtilization() {
    const providers = await prisma.provider.findMany({
      where: { isActive: true },
      include: {
        user: { select: { name: true } },
        _count: { select: { bookings: { where: { status: { notIn: ['CANCELLED'] } } } } },
      },
    });
    return providers.map((p) => ({
      id: p.id,
      name: p.user.name,
      totalBookings: p._count.bookings,
    }));
  }

  async getBookingStatusBreakdown() {
    const statuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    const counts = await Promise.all(
      statuses.map(async (status) => ({
        status,
        count: await prisma.booking.count({ where: { status: status as BookingStatus } }),
      })),
    );
    return counts;
  }
}

export const dashboardRepository = new DashboardRepository();
