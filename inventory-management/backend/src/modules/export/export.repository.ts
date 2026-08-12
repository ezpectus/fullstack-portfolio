import { prisma } from '../../config/db';

export class ExportRepository {
  async findAllProductsWithCategory() {
    return prisma.product.findMany({
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  async findAllStockMovements() {
    return prisma.stockMovement.findMany({
      include: { product: true, warehouse: true, user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllPurchaseOrders() {
    return prisma.purchaseOrder.findMany({
      include: { supplier: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const exportRepository = new ExportRepository();
