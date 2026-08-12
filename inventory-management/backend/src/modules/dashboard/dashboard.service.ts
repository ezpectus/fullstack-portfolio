import { dashboardRepository } from './dashboard.repository';
import { redis } from '../../config/redis';

export class DashboardService {
  async getMetrics() {
    const cached = await redis.get('dashboard:metrics');
    if (cached) return JSON.parse(cached);

    const [totalProducts, totalWarehouses, totalSuppliers, totalMovements, lowStockProducts, recentMovements, movementsByType] = await Promise.all([
      dashboardRepository.countProducts(),
      dashboardRepository.countWarehouses(),
      dashboardRepository.countSuppliers(),
      dashboardRepository.countStockMovements(),
      dashboardRepository.findLowStockProducts(),
      dashboardRepository.findRecentMovements(),
      dashboardRepository.groupMovementsByType(),
    ]);

    const metrics = {
      totalProducts,
      totalWarehouses,
      totalSuppliers,
      totalMovements,
      lowStockAlerts: lowStockProducts,
      recentMovements,
      movementsByType,
    };

    await redis.set('dashboard:metrics', JSON.stringify(metrics), 'EX', 300);
    return metrics;
  }

  async getInventoryTrends() {
    const cached = await redis.get('dashboard:trends');
    if (cached) return JSON.parse(cached);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const movements = await dashboardRepository.findMovementsSince(thirtyDaysAgo);

    const dailyData: Record<string, { in: number; out: number; transfer: number }> = {};
    for (const m of movements) {
      const date = m.createdAt.toISOString().split('T')[0];
      if (!dailyData[date]) dailyData[date] = { in: 0, out: 0, transfer: 0 };
      if (m.type === 'IN') dailyData[date].in += m.quantity;
      else if (m.type === 'OUT') dailyData[date].out += m.quantity;
      else if (m.type === 'TRANSFER') dailyData[date].transfer += m.quantity;
    }

    const trends = Object.entries(dailyData).map(([date, data]) => ({ date, ...data }));
    await redis.set('dashboard:trends', JSON.stringify(trends), 'EX', 300);
    return trends;
  }
}

export const dashboardService = new DashboardService();
