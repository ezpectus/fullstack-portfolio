import { prisma } from '../../config/db';

export class DashboardRepository {
  async countInvoices(userId: string) {
    return prisma.invoice.count({ where: { userId } });
  }

  async countInvoicesByStatus(userId: string, status: string) {
    return prisma.invoice.count({ where: { userId, status: status as never } });
  }

  async sumMonthlyBilled(userId: string, startOfMonth: Date, endOfMonth: Date) {
    return prisma.invoice.aggregate({
      where: { userId, issueDate: { gte: startOfMonth, lte: endOfMonth }, status: { in: ['SENT', 'PAID', 'OVERDUE'] } },
      _sum: { total: true },
    });
  }

  async sumMonthlyPaid(userId: string, startOfMonth: Date, endOfMonth: Date) {
    return prisma.invoice.aggregate({
      where: { userId, paidAt: { gte: startOfMonth, lte: endOfMonth }, status: 'PAID' },
      _sum: { total: true },
    });
  }

  async sumOverdueAmount(userId: string) {
    return prisma.invoice.aggregate({
      where: { userId, status: 'OVERDUE' },
      _sum: { total: true },
    });
  }

  async findRecentInvoices(userId: string) {
    return prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { client: { select: { name: true, company: true } } },
    });
  }

  async findTopClients(userId: string) {
    return prisma.client.findMany({
      where: { userId },
      select: { id: true, name: true, invoices: { where: { status: { in: ['SENT', 'PAID'] } }, select: { total: true } } },
      take: 20,
    });
  }
}

export const dashboardRepository = new DashboardRepository();
