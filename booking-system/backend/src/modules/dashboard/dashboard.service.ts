import { prisma } from '../../config/db';

export class DashboardService {
  async getOverview() {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCustomers,
      totalProviders,
      totalServices,
      totalRevenue,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      prisma.customer.count(),
      prisma.provider.count({ where: { isActive: true } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.booking.aggregate({ where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }, _sum: { price: true } }),
    ]);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCustomers,
      totalProviders,
      totalServices,
      totalRevenue: totalRevenue._sum.price || 0,
    };
  }

  async getBookingsByDay(startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date();
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: { startTime: { gte: start, lte: end }, status: { notIn: ['CANCELLED'] } },
      select: { startTime: true, status: true, price: true },
      orderBy: { startTime: 'asc' },
    });

    const byDay: Record<string, { date: string; count: number; revenue: number }> = {};
    for (const b of bookings) {
      const dateKey = b.startTime.toISOString().split('T')[0];
      if (!byDay[dateKey]) byDay[dateKey] = { date: dateKey, count: 0, revenue: 0 };
      byDay[dateKey].count++;
      byDay[dateKey].revenue += b.price;
    }

    return Object.values(byDay);
  }

  async getTopServices() {
    const grouped = await prisma.booking.groupBy({
      by: ['serviceId'],
      where: { status: { notIn: ['CANCELLED'] } },
      _count: true,
      _sum: { price: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 5,
    });

    const services = await prisma.service.findMany({
      where: { id: { in: grouped.map((g) => g.serviceId) } },
      select: { id: true, name: true },
    });

    return grouped.map((g) => {
      const service = services.find((s) => s.id === g.serviceId);
      return {
        id: g.serviceId,
        name: service?.name || 'Unknown',
        bookingCount: g._count,
        revenue: g._sum.price || 0,
      };
    });
  }

  async getTopProviders() {
    const grouped = await prisma.booking.groupBy({
      by: ['providerId'],
      where: { status: { notIn: ['CANCELLED'] } },
      _count: true,
      _sum: { price: true },
      orderBy: { _count: { providerId: 'desc' } },
      take: 5,
    });

    const providers = await prisma.provider.findMany({
      where: { id: { in: grouped.map((g) => g.providerId) } },
      include: { user: { select: { name: true } } },
    });

    return grouped.map((g) => {
      const provider = providers.find((p) => p.id === g.providerId);
      return {
        id: g.providerId,
        name: provider?.user.name || 'Unknown',
        bookingCount: g._count,
        revenue: g._sum.price || 0,
      };
    });
  }

  async getUpcomingBookings(limit = 10) {
    const now = new Date();
    return prisma.booking.findMany({
      where: { startTime: { gte: now }, status: { in: ['PENDING', 'CONFIRMED'] } },
      include: { service: true, provider: { include: { user: { select: { name: true } } } }, customer: true },
      orderBy: { startTime: 'asc' },
      take: limit,
    });
  }
}

export const dashboardService = new DashboardService();
