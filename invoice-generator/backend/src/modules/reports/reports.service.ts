import { reportsRepository } from './reports.repository';

export class ReportsService {
  async getRevenueReport(userId: string, startDate: Date, endDate: Date) {
    const invoices = await reportsRepository.findRevenueInvoices(userId, startDate, endDate);

    const totalBilled = invoices.reduce((s, i) => s + i.total, 0);
    const totalPaid = invoices.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.total, 0);
    const totalOutstanding = totalBilled - totalPaid;

    const byMonth: Record<string, { billed: number; paid: number }> = {};
    for (const inv of invoices) {
      const key = inv.issueDate.toISOString().slice(0, 7);
      if (!byMonth[key]) byMonth[key] = { billed: 0, paid: 0 };
      byMonth[key].billed += inv.total;
      if (inv.status === 'PAID') byMonth[key].paid += inv.total;
    }

    return {
      totalBilled: Math.round(totalBilled * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalOutstanding: Math.round(totalOutstanding * 100) / 100,
      chart: Object.entries(byMonth).map(([month, v]) => ({ month, ...v })),
    };
  }

  async getOverdueReport(userId: string) {
    const overdue = await reportsRepository.findOverdueInvoices(userId);
    const totalOverdue = overdue.reduce((s, i) => s + i.total, 0);
    return { items: overdue, total: overdue.length, totalAmount: Math.round(totalOverdue * 100) / 100 };
  }

  async getTopClients(userId: string, startDate: Date, endDate: Date) {
    const clients = await reportsRepository.findTopClients(userId, startDate, endDate);

    const ranked = clients
      .map((c) => {
        const billed = c.invoices.reduce((s, i) => s + i.total, 0);
        const paid = c.invoices.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.total, 0);
        return { id: c.id, name: c.name, email: c.email, billed, paid, outstanding: billed - paid };
      })
      .filter((c) => c.billed > 0)
      .sort((a, b) => b.billed - a.billed)
      .slice(0, 10);

    return ranked;
  }

  async exportRevenueCsv(userId: string, startDate: Date, endDate: Date) {
    const report = await this.getRevenueReport(userId, startDate, endDate);
    const headers = ['Month', 'Billed', 'Paid'];
    const rows = report.chart.map((r) => [r.month, String(r.billed), String(r.paid)]);
    const csv = [headers, ...rows]
      .map((row) => row.map((field) => {
        const escaped = String(field).replace(/"/g, '""');
        if (/^[=+\-@]/.test(escaped)) {
          return `"'${escaped}"`;
        }
        return `"${escaped}"`;
      }).join(','))
      .join('\n');
    return csv;
  }
}

export const reportsService = new ReportsService();
