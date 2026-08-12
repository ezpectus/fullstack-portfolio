import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class DealsRepository {
  async findMany(params: {
    skip: number;
    take: number;
    where: Prisma.DealWhereInput;
    orderBy?: Prisma.DealOrderByWithRelationInput;
  }) {
    const [data, total] = await Promise.all([
      prisma.deal.findMany({
        where: params.where,
        skip: params.skip,
        take: params.take,
        include: {
          customer: { select: { id: true, name: true, company: true } },
          assignedTo: { select: { id: true, name: true } },
        },
        orderBy: params.orderBy ?? { createdAt: 'desc' },
      }),
      prisma.deal.count({ where: params.where }),
    ]);
    return { data, total };
  }

  async findById(id: string) {
    return prisma.deal.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, company: true, email: true, phone: true } },
        assignedTo: { select: { id: true, name: true } },
        notes: {
          select: { id: true, content: true, isPinned: true, createdAt: true },
          orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });
  }

  async create(data: Prisma.DealCreateInput) {
    return prisma.deal.create({
      data,
      include: {
        customer: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: Prisma.DealUpdateInput) {
    return prisma.deal.update({
      where: { id },
      data,
      include: {
        customer: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string) {
    return prisma.deal.delete({ where: { id } });
  }

  async findKanban(where?: Prisma.DealWhereInput) {
    const deals = await prisma.deal.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, company: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;
    const kanban: Record<string, typeof deals> = {};
    for (const stage of stages) {
      kanban[stage] = deals.filter((d) => d.stage === stage);
    }
    return kanban;
  }

  async findAllForExport(where?: Prisma.DealWhereInput) {
    return prisma.deal.findMany({
      where,
      include: {
        customer: { select: { name: true, company: true } },
        assignedTo: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countByStage(where?: Prisma.DealWhereInput) {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;
    const counts = await Promise.all(
      stages.map((stage) =>
        prisma.deal.count({ where: { ...where, stage } }),
      ),
    );
    return stages.map((stage, i) => ({ stage, count: counts[i] }));
  }

  async sumAmountByStage(where?: Prisma.DealWhereInput) {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;
    const results = await Promise.all(
      stages.map((stage) =>
        prisma.deal.aggregate({
          where: { ...where, stage },
          _sum: { amount: true },
        }),
      ),
    );
    return stages.map((stage, i) => ({
      stage,
      total: results[i]._sum.amount ?? 0,
    }));
  }
}

export const dealsRepository = new DealsRepository();
