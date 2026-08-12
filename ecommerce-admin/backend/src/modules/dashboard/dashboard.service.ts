import { prisma } from '../../config/db';

export class DashboardService {
  async getOverview() {
    const [totalProducts, totalOrders, totalCustomers, totalRevenue, recentOrders, pendingOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.aggregate({ where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } }, _sum: { total: true } }),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { customer: true, items: true } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
    ]);
    return {
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders,
      },
      recentOrders,
    };
  }
}

export const dashboardService = new DashboardService();
