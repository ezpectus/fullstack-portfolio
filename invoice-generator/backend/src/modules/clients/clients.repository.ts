import { Prisma } from '@prisma/client';
import { prisma } from '../../config/db';

export class ClientsRepository {
  async findMany(userId: string, skip: number, take: number, where: Prisma.ClientWhereInput, orderBy: Prisma.ClientOrderByWithRelationInput) {
    const [items, total] = await Promise.all([
      prisma.client.findMany({ where: { ...where, userId }, skip, take, orderBy, include: { _count: { select: { invoices: true } } } }),
      prisma.client.count({ where: { ...where, userId } }),
    ]);
    return { items, total };
  }

  async findById(id: string, userId: string) {
    return prisma.client.findFirst({ where: { id, userId }, include: { invoices: { orderBy: { createdAt: 'desc' }, take: 10 } } });
  }

  async create(data: Prisma.ClientUncheckedCreateInput) {
    return prisma.client.create({ data });
  }

  async update(id: string, userId: string, data: Prisma.ClientUpdateInput) {
    return prisma.client.update({ where: { id, userId }, data });
  }

  async delete(id: string, userId: string) {
    return prisma.client.delete({ where: { id, userId } });
  }

  async getStats(userId: string) {
    const clients = await prisma.client.findMany({
      where: { userId },
      select: {
        id: true,
        invoices: { select: { status: true, total: true } },
      },
    });
    return clients.map((c) => {
      const invoiced = c.invoices.reduce((s, i) => s + i.total, 0);
      const paid = c.invoices.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.total, 0);
      return { id: c.id, invoiced, paid, outstanding: invoiced - paid };
    });
  }
}

export const clientsRepository = new ClientsRepository();
