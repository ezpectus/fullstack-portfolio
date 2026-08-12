import { prisma } from '../../config/db';
import { NotFoundError, BadRequestError } from '../../shared/errors';
import type { CreateMovementInput, MovementPaginationInput } from './stock-movements.dto';
import type { Prisma } from '@prisma/client';

export class StockMovementRepository {
  async findMany(params: MovementPaginationInput) {
    const { page, limit, productId, warehouseId, type, startDate, endDate } = params;
    const where: Prisma.StockMovementWhereInput = {};
    if (productId) where.productId = productId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (type) where.type = type;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        include: { product: true, warehouse: true, user: { select: { id: true, name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(data: CreateMovementInput, userId: string) {
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) throw new NotFoundError('Product');

    const warehouse = await prisma.warehouse.findUnique({ where: { id: data.warehouseId } });
    if (!warehouse) throw new NotFoundError('Warehouse');

    if (data.type === 'TRANSFER') {
      if (!data.fromWarehouseId) throw new BadRequestError('fromWarehouseId is required for TRANSFER');
      const fromWh = await prisma.warehouse.findUnique({ where: { id: data.fromWarehouseId } });
      if (!fromWh) throw new NotFoundError('Source warehouse');
    }

    if (data.type === 'OUT' || data.type === 'TRANSFER') {
      const checkWarehouseId = data.type === 'TRANSFER' ? data.fromWarehouseId! : data.warehouseId;
      const stockLevel = await prisma.stockLevel.findUnique({
        where: { productId_warehouseId: { productId: data.productId, warehouseId: checkWarehouseId } },
      });
      if (!stockLevel || stockLevel.quantity < data.quantity) {
        throw new BadRequestError('Insufficient stock for this movement');
      }
    }

    return prisma.$transaction(async (tx) => {
      const movement = await tx.stockMovement.create({
        data: { ...data, userId },
        include: { product: true, warehouse: true, user: { select: { id: true, name: true } } },
      });

      if (data.type === 'IN' || data.type === 'ADJUSTMENT') {
        await tx.stockLevel.upsert({
          where: { productId_warehouseId: { productId: data.productId, warehouseId: data.warehouseId } },
          create: { productId: data.productId, warehouseId: data.warehouseId, quantity: data.quantity },
          update: { quantity: { increment: data.quantity } },
        });
      } else if (data.type === 'OUT') {
        await tx.stockLevel.update({
          where: { productId_warehouseId: { productId: data.productId, warehouseId: data.warehouseId } },
          data: { quantity: { decrement: data.quantity } },
        });
      } else if (data.type === 'TRANSFER') {
        await tx.stockLevel.update({
          where: { productId_warehouseId: { productId: data.productId, warehouseId: data.fromWarehouseId! } },
          data: { quantity: { decrement: data.quantity } },
        });
        await tx.stockLevel.upsert({
          where: { productId_warehouseId: { productId: data.productId, warehouseId: data.warehouseId } },
          create: { productId: data.productId, warehouseId: data.warehouseId, quantity: data.quantity },
          update: { quantity: { increment: data.quantity } },
        });
      }

      return movement;
    });
  }
}

export const stockMovementRepository = new StockMovementRepository();
