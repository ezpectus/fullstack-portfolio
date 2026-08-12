import { dashboardRepository } from './dashboard.repository';
import { ROLES } from '../../shared/constants';
import type { AuthPayload } from '../../shared/types';

export class DashboardService {
  async getStats(user: AuthPayload) {
    const customerWhere = user.role === ROLES.SALES_REP ? { assignedToId: user.userId } : {};
    const dealWhere = user.role === ROLES.SALES_REP ? { assignedToId: user.userId } : {};

    const [
      totalCustomers,
      activeDeals,
      pipelineAmount,
      wonThisMonth,
    ] = await Promise.all([
      dashboardRepository.countCustomers(customerWhere),
      dashboardRepository.countDeals({ ...dealWhere, stage: { notIn: ['won', 'lost'] } }),
      dashboardRepository.aggregateDeals({ ...dealWhere, stage: { notIn: ['won', 'lost'] } }),
      dashboardRepository.aggregateDeals({
        ...dealWhere,
        stage: 'won',
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    return {
      totalCustomers,
      activeDeals,
      pipelineAmount: pipelineAmount._sum.amount ?? 0,
      wonThisMonth: wonThisMonth._sum.amount ?? 0,
    };
  }

  async getDealsByStage(user: AuthPayload) {
    const where = user.role === ROLES.SALES_REP ? { assignedToId: user.userId } : {};
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const;

    const counts = await Promise.all(
      stages.map((stage) => dashboardRepository.countDealsByStage(stage, where)),
    );

    return stages.map((stage, i) => ({ stage, count: counts[i] }));
  }

  async getNewCustomers(user: AuthPayload, days = 30) {
    const where: { assignedToId?: string; createdAt?: { gte: Date } } = {};
    if (user.role === ROLES.SALES_REP) {
      where.assignedToId = user.userId;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    where.createdAt = { gte: startDate };

    const customers = await dashboardRepository.findNewCustomers(where);

    const byDate: Record<string, number> = {};
    for (const c of customers) {
      const dateKey = c.createdAt.toISOString().split('T')[0];
      byDate[dateKey] = (byDate[dateKey] ?? 0) + 1;
    }

    return Object.entries(byDate).map(([date, count]) => ({ date, count }));
  }

  async getRecentActivity(user: AuthPayload, limit = 10) {
    const dealWhere = user.role === ROLES.SALES_REP ? { assignedToId: user.userId } : {};
    const customerWhere = user.role === ROLES.SALES_REP ? { assignedToId: user.userId } : {};
    const noteWhere = user.role === ROLES.SALES_REP ? { createdById: user.userId } : {};

    const [recentDeals, recentCustomers, recentNotes] = await Promise.all([
      dashboardRepository.findRecentDeals(dealWhere, limit),
      dashboardRepository.findRecentCustomers(customerWhere, limit),
      dashboardRepository.findRecentNotes(noteWhere, limit),
    ]);

    const activity = [
      ...recentDeals.map((d) => ({ type: 'deal' as const, id: d.id, title: d.title, subtitle: d.customer?.name ?? '', meta: d.stage, updatedAt: d.updatedAt })),
      ...recentCustomers.map((c) => ({ type: 'customer' as const, id: c.id, title: c.name, subtitle: '', meta: c.status, updatedAt: c.updatedAt })),
      ...recentNotes.map((n) => ({ type: 'note' as const, id: n.id, title: n.content.substring(0, 50), subtitle: n.createdBy?.name ?? '', meta: '', updatedAt: n.updatedAt })),
    ];

    return activity.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1)).slice(0, limit);
  }
}

export const dashboardService = new DashboardService();
