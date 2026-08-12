import { prisma } from '../../config/db';
import { NotFoundError, ConflictError } from '../../shared/errors';
import type { CreateProductInput, UpdateProductInput, ProductPaginationInput } from './products.dto';
import type { Prisma } from '@prisma/client';

export class ProductRepository {
  async findMany(params: ProductPaginationInput) {
    const { page, limit, search, categoryId, sortBy, sortOrder } = params;
    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, movements: { take: 20, orderBy: { createdAt: 'desc' }, include: { warehouse: true } } },
    });
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async create(data: CreateProductInput) {
    const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existing) throw new ConflictError('SKU already exists');
    return prisma.product.create({ data, include: { category: true } });
  }

  async update(id: string, data: UpdateProductInput) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');
    if (data.sku && data.sku !== product.sku) {
      const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
      if (existing) throw new ConflictError('SKU already exists');
    }
    return prisma.product.update({ where: { id }, data, include: { category: true } });
  }

  async delete(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');
    return prisma.product.delete({ where: { id } });
  }

  async getStockLevels(productId: string) {
    const movements = await prisma.stockMovement.findMany({
      where: { productId },
      include: { warehouse: true },
    });
    const stockByWarehouse: Record<string, number> = {};
    for (const m of movements) {
      const wid = m.warehouseId;
      if (!stockByWarehouse[wid]) stockByWarehouse[wid] = 0;
      if (m.type === 'IN' || m.type === 'ADJUSTMENT') stockByWarehouse[wid] += m.quantity;
      else if (m.type === 'OUT') stockByWarehouse[wid] -= m.quantity;
      else if (m.type === 'TRANSFER') {
        stockByWarehouse[wid] -= m.quantity;
        if (m.fromWarehouseId) {
          if (!stockByWarehouse[m.fromWarehouseId]) stockByWarehouse[m.fromWarehouseId] = 0;
          stockByWarehouse[m.fromWarehouseId] += m.quantity;
        }
      }
    }
    return Object.entries(stockByWarehouse).map(([warehouseId, quantity]) => ({
      warehouseId,
      warehouseName: movements.find((m) => m.warehouseId === warehouseId)?.warehouse.name || '',
      quantity,
    }));
  }
}

export const productRepository = new ProductRepository();
