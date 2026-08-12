import { prisma } from '../../config/db';

export class DashboardRepository {
  async countProducts() {
    return prisma.product.count();
  }

  async countWarehouses() {
    return prisma.warehouse.count();
  }

  async countSuppliers() {
    return prisma.supplier.count();
  }

  async countStockMovements() {
    return prisma.stockMovement.count();
  }

  async findLowStockProducts() {
    return prisma.product.findMany({
      where: { minStock: { gt: 0 } },
      select: { id: true, name: true, sku: true, minStock: true },
    });
  }

  async findRecentMovements() {
    return prisma.stockMovement.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { product: true, warehouse: true },
    });
  }

  async groupMovementsByType() {
    return prisma.stockMovement.groupBy({
      by: ['type'],
      _count: true,
    });
  }

  async findMovementsSince(since: Date) {
    return prisma.stockMovement.findMany({
      where: { createdAt: { gte: since } },
      select: { type: true, quantity: true, createdAt: true },
    });
  }
}

export const dashboardRepository = new DashboardRepository();
