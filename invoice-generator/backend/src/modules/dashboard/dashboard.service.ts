import { dashboardRepository } from './dashboard.repository';

export class DashboardService {
  async getStats(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [totalInvoices, draftCount, sentCount, paidCount, overdueCount, monthlyBilled, monthlyPaid, overdueAmount, recentInvoices, topClients] = await Promise.all([
      dashboardRepository.countInvoices(userId),
      dashboardRepository.countInvoicesByStatus(userId, 'DRAFT'),
      dashboardRepository.countInvoicesByStatus(userId, 'SENT'),
      dashboardRepository.countInvoicesByStatus(userId, 'PAID'),
      dashboardRepository.countInvoicesByStatus(userId, 'OVERDUE'),
      dashboardRepository.sumMonthlyBilled(userId, startOfMonth, endOfMonth),
      dashboardRepository.sumMonthlyPaid(userId, startOfMonth, endOfMonth),
      dashboardRepository.sumOverdueAmount(userId),
      dashboardRepository.findRecentInvoices(userId),
      dashboardRepository.findTopClients(userId),
    ]);

    const topClientsRanked = topClients
      .map((c) => ({ id: c.id, name: c.name, totalBilled: c.invoices.reduce((s, i) => s + i.total, 0) }))
      .sort((a, b) => b.totalBilled - a.totalBilled)
      .slice(0, 5);

    return {
      counts: { total: totalInvoices, draft: draftCount, sent: sentCount, paid: paidCount, overdue: overdueCount },
      monthly: { billed: monthlyBilled._sum.total || 0, paid: monthlyPaid._sum.total || 0 },
      overdueAmount: overdueAmount._sum.total || 0,
      recentInvoices,
      topClients: topClientsRanked,
    };
  }
}

export const dashboardService = new DashboardService();
