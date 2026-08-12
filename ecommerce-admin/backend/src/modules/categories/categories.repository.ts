import { prisma } from '../../config/db';
import type { Category } from '@prisma/client';

export class CategoriesRepository {
  async findMany(params: { skip: number; limit: number; search?: string; parentId?: string }) {
    const where: any = {};
    if (params.search) where.name = { contains: params.search, mode: 'insensitive' };
    if (params.parentId) where.parentId = params.parentId;
    const [categories, total] = await Promise.all([
      prisma.category.findMany({ where, skip: params.skip, take: params.limit, include: { children: true, _count: { select: { products: true } } }, orderBy: { name: 'asc' } }),
      prisma.category.count({ where }),
    ]);
    return { categories, total };
  }

  async findTree() {
    return prisma.category.findMany({
      where: { parentId: null },
      include: { children: { include: { children: { include: { children: true } } } } },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id }, include: { children: true, parent: true, _count: { select: { products: true } } } });
  }

  async create(data: { name: string; slug: string; image?: string; parentId?: string | null }): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: Partial<{ name: string; slug: string; image?: string; parentId?: string | null }>): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}

export const categoriesRepository = new CategoriesRepository();
