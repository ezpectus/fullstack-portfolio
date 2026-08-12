import { prisma } from '../../config/db';

export class AnalyticsService {
  async getRevenueChart(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    const orders = await prisma.order.findMany({
      where: { ...where, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    const byDay: Record<string, number> = {};
    for (const order of orders) {
      const day = order.createdAt.toISOString().split('T')[0];
      byDay[day] = (byDay[day] || 0) + order.total;
    }
    return Object.entries(byDay).map(([date, revenue]) => ({ date, revenue }));
  }

  async getOrdersChart(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    const orders = await prisma.order.findMany({
      where,
      select: { status: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    const byDay: Record<string, number> = {};
    for (const order of orders) {
      const day = order.createdAt.toISOString().split('T')[0];
      byDay[day] = (byDay[day] || 0) + 1;
    }
    return Object.entries(byDay).map(([date, count]) => ({ date, count }));
  }

  async getTopProducts(limit = 10) {
    const items = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { totalPrice: 'desc' } },
      take: limit,
    });
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
      select: { id: true, name: true, sku: true },
    });
    return items.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }));
  }

  async getTopCategories() {
    const products = await prisma.product.findMany({
      select: { id: true, categoryId: true, category: { select: { id: true, name: true } } },
    });
    const items = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { totalPrice: true },
    });
    const byCategory: Record<string, { name: string; revenue: number }> = {};
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product?.category) {
        const catId = product.category.id;
        if (!byCategory[catId]) byCategory[catId] = { name: product.category.name, revenue: 0 };
        byCategory[catId].revenue += item._sum.totalPrice || 0;
      }
    }
    return Object.entries(byCategory).map(([id, data]) => ({ id, ...data }));
  }

  async getSummary(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    const [orders, refundedOrders, allOrders] = await Promise.all([
      prisma.order.aggregate({ where: { ...where, status: { notIn: ['CANCELLED', 'REFUNDED'] } }, _sum: { total: true }, _count: true }),
      prisma.order.aggregate({ where: { ...where, status: 'REFUNDED' }, _count: true }),
      prisma.order.aggregate({ where, _count: true }),
    ]);
    const totalRevenue = orders._sum.total || 0;
    const orderCount = orders._count || 0;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
    const refundRate = allOrders._count > 0 ? (refundedOrders._count / allOrders._count) * 100 : 0;
    return { totalRevenue, orderCount, avgOrderValue, refundRate };
  }
}

export const analyticsService = new AnalyticsService();
