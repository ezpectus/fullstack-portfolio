import { prisma } from '../../config/db';
import { NotFoundError } from '../../shared/errors';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.dto';

export class CategoryRepository {
  async findTree() {
    const categories = await prisma.category.findMany({
      include: { children: true, products: true },
      orderBy: { name: 'asc' },
    });
    return categories;
  }

  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { parent: true, children: true, products: true },
    });
    if (!category) throw new NotFoundError('Category');
    return category;
  }

  async create(data: CreateCategoryInput) {
    return prisma.category.create({ data, include: { parent: true } });
  }

  async update(id: string, data: UpdateCategoryInput) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Category');
    return prisma.category.update({ where: { id }, data, include: { parent: true, children: true } });
  }

  async delete(id: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Category');
    return prisma.category.delete({ where: { id } });
  }
}

export const categoryRepository = new CategoryRepository();
