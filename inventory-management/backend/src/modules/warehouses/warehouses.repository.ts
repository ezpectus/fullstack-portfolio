import { prisma } from '../../config/db';
import { NotFoundError } from '../../shared/errors';
import type { CreateWarehouseInput, UpdateWarehouseInput } from './warehouses.dto';

export class WarehouseRepository {
  async findAll() {
    return prisma.warehouse.findMany({ include: { supplier: true }, orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: { supplier: true, stockMovements: { take: 20, orderBy: { createdAt: 'desc' }, include: { product: true } } },
    });
    if (!warehouse) throw new NotFoundError('Warehouse');
    return warehouse;
  }

  async create(data: CreateWarehouseInput) {
    return prisma.warehouse.create({ data, include: { supplier: true } });
  }

  async update(id: string, data: UpdateWarehouseInput) {
    const warehouse = await prisma.warehouse.findUnique({ where: { id } });
    if (!warehouse) throw new NotFoundError('Warehouse');
    return prisma.warehouse.update({ where: { id }, data, include: { supplier: true } });
  }

  async delete(id: string) {
    const warehouse = await prisma.warehouse.findUnique({ where: { id } });
    if (!warehouse) throw new NotFoundError('Warehouse');
    return prisma.warehouse.delete({ where: { id } });
  }

  async getStockLevels(warehouseId: string) {
    const movements = await prisma.stockMovement.findMany({
      where: { warehouseId },
      include: { product: true },
    });
    const stockByProduct: Record<string, { productName: string; sku: string; quantity: number }> = {};
    for (const m of movements) {
      const pid = m.productId;
      if (!stockByProduct[pid]) stockByProduct[pid] = { productName: m.product.name, sku: m.product.sku, quantity: 0 };
      if (m.type === 'IN' || m.type === 'ADJUSTMENT') stockByProduct[pid].quantity += m.quantity;
      else if (m.type === 'OUT') stockByProduct[pid].quantity -= m.quantity;
      else if (m.type === 'TRANSFER') stockByProduct[pid].quantity -= m.quantity;
    }
    return Object.entries(stockByProduct).map(([productId, data]) => ({ productId, ...data }));
  }
}

export const warehouseRepository = new WarehouseRepository();
