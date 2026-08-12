import { prisma } from '../../config/db';

export class ReportsRepository {
  async findRevenueInvoices(userId: string, startDate: Date, endDate: Date) {
    return prisma.invoice.findMany({
      where: {
        userId,
        issueDate: { gte: startDate, lte: endDate },
        status: { in: ['SENT', 'PAID', 'OVERDUE'] },
      },
      select: { total: true, status: true, issueDate: true },
    });
  }

  async findOverdueInvoices(userId: string) {
    const now = new Date();
    return prisma.invoice.findMany({
      where: {
        userId,
        status: 'OVERDUE',
        dueDate: { lt: now },
      },
      include: { client: { select: { name: true, email: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findTopClients(userId: string, startDate: Date, endDate: Date) {
    return prisma.client.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        email: true,
        invoices: {
          where: { issueDate: { gte: startDate, lte: endDate }, status: { in: ['SENT', 'PAID', 'OVERDUE'] } },
          select: { total: true, status: true },
        },
      },
    });
  }
}

export const reportsRepository = new ReportsRepository();
