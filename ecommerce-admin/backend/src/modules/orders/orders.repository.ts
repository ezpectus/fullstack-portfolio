import { prisma } from '../../config/db';

export class OrdersRepository {
  async findMany(params: { skip: number; limit: number; search?: string; status?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; startDate?: string; endDate?: string }) {
    const where: any = {};
    if (params.search) where.orderNumber = { contains: params.search, mode: 'insensitive' };
    if (params.status) where.status = params.status;
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }
    const orderBy: any = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' };
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, skip: params.skip, take: params.limit, orderBy, include: { customer: true, items: { include: { product: true, variant: true } }, statusHistory: { include: { user: { select: { id: true, name: true } } } } } }),
      prisma.order.count({ where }),
    ]);
    return { orders, total };
  }

  async findById(id: string) {
    return prisma.order.findUnique({ where: { id }, include: { customer: { include: { addresses: true } }, items: { include: { product: { include: { images: true } }, variant: true } }, statusHistory: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } }, promoCode: true } });
  }

  async create(data: any) {
    return prisma.order.create({ data, include: { items: true, customer: true } });
  }

  async updateStatus(id: string, status: string, userId?: string, comment?: string) {
    const [order] = await prisma.$transaction([
      prisma.order.update({ where: { id }, data: { status: status as any }, include: { items: true, customer: true } }),
      prisma.orderStatusHistory.create({ data: { orderId: id, status: status as any, userId, comment } }),
    ]);
    return order;
  }
}

export const ordersRepository = new OrdersRepository();
