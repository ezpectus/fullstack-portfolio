import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class CustomersRepository {
  async findMany(params: {
    skip: number;
    take: number;
    where: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithRelationInput;
  }) {
    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where: params.where,
        skip: params.skip,
        take: params.take,
        include: {
          assignedTo: { select: { id: true, name: true } },
          _count: { select: { deals: true, notes: true } },
        },
        orderBy: params.orderBy ?? { createdAt: 'desc' },
      }),
      prisma.customer.count({ where: params.where }),
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true } },
        deals: {
          select: { id: true, title: true, amount: true, stage: true, currency: true },
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          where: { dealId: null },
          select: { id: true, content: true, isPinned: true, createdAt: true },
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });
  }

  async create(data: Prisma.CustomerCreateInput) {
    return prisma.customer.create({
      data,
      include: { assignedTo: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, data: Prisma.CustomerUpdateInput) {
    return prisma.customer.update({
      where: { id },
      data,
      include: { assignedTo: { select: { id: true, name: true } } },
    });
  }

  async delete(id: string) {
    return prisma.customer.delete({ where: { id } });
  }

  async findTimeline(id: string) {
    const [deals, notes] = await Promise.all([
      prisma.deal.findMany({
        where: { customerId: id },
        select: {
          id: true,
          title: true,
          stage: true,
          amount: true,
          currency: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.note.findMany({
        where: { customerId: id },
        select: { id: true, content: true, isPinned: true, createdAt: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return [
      ...deals.map((d) => ({ type: 'deal' as const, ...d })),
      ...notes.map((n) => ({ type: 'note' as const, ...n })),
    ].sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
  }

  async findAllForExport(where?: Prisma.CustomerWhereInput) {
    return prisma.customer.findMany({
      where,
      include: { assignedTo: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const customersRepository = new CustomersRepository();
