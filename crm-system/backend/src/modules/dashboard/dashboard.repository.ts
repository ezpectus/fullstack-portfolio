import { prisma } from '../../config/db';
import type { Prisma } from '@prisma/client';
import { DealStage } from '@prisma/client';

export class DashboardRepository {
  async countCustomers(where: Prisma.CustomerWhereInput) {
    return prisma.customer.count({ where });
  }

  async countDeals(where: Prisma.DealWhereInput) {
    return prisma.deal.count({ where });
  }

  async aggregateDeals(where: Prisma.DealWhereInput) {
    return prisma.deal.aggregate({
      where,
      _sum: { amount: true },
    });
  }

  async countDealsByStage(stage: DealStage, where: Prisma.DealWhereInput) {
    return prisma.deal.count({ where: { ...where, stage } });
  }

  async findNewCustomers(where: Prisma.CustomerWhereInput) {
    return prisma.customer.findMany({
      where,
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findRecentDeals(where: Prisma.DealWhereInput, limit: number) {
    return prisma.deal.findMany({
      where,
      select: { id: true, title: true, stage: true, updatedAt: true, customer: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }

  async findRecentCustomers(where: Prisma.CustomerWhereInput, limit: number) {
    return prisma.customer.findMany({
      where,
      select: { id: true, name: true, status: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }

  async findRecentNotes(where: Prisma.NoteWhereInput, limit: number) {
    return prisma.note.findMany({
      where,
      select: { id: true, content: true, updatedAt: true, createdBy: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }
}

export const dashboardRepository = new DashboardRepository();
