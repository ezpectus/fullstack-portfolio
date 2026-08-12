import { prisma } from '../../config/db';
import type { Product } from '@prisma/client';

export class ProductsRepository {
  async findMany(params: { skip: number; limit: number; search?: string; status?: string; categoryId?: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; minPrice?: number; maxPrice?: number }) {
    const where: any = {};
    if (params.search) where.OR = [{ name: { contains: params.search, mode: 'insensitive' } }, { sku: { contains: params.search, mode: 'insensitive' } }];
    if (params.status) where.status = params.status;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) where.price.gte = params.minPrice;
      if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
    }
    const orderBy: any = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' };
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip: params.skip, take: params.limit, orderBy, include: { category: true, variants: true, images: { orderBy: { position: 'asc' } }, _count: { select: { orderItems: true } } } }),
      prisma.product.count({ where }),
    ]);
    return { products, total };
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id }, include: { category: true, variants: true, images: { orderBy: { position: 'asc' } }, user: { select: { id: true, name: true } } } });
  }

  async create(data: any): Promise<Product> {
    return prisma.product.create({ data, include: { variants: true, images: true } });
  }

  async update(id: string, data: any): Promise<Product> {
    return prisma.product.update({ where: { id }, data, include: { variants: true, images: true, category: true } });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}

export const productsRepository = new ProductsRepository();
