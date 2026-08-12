import { prisma } from '../../config/db';
import { NotFoundError } from '../../shared/errors';
import type { Prisma } from '@prisma/client';

export class TemplatesService {
  async list(userId: string, page: number, limit: number, search?: string) {
    const where: Prisma.TemplateWhereInput = {
      userId,
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.template.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.template.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(userId: string, id: string) {
    const template = await prisma.template.findFirst({ where: { id, userId } });
    if (!template) throw new NotFoundError('Template');
    return template;
  }

  async create(userId: string, data: Omit<Prisma.TemplateUncheckedCreateInput, 'userId'>) {
    return prisma.template.create({ data: { ...data, userId } });
  }

  async update(userId: string, id: string, data: Prisma.TemplateUpdateInput) {
    const template = await prisma.template.findFirst({ where: { id, userId } });
    if (!template) throw new NotFoundError('Template');
    return prisma.template.update({ where: { id }, data });
  }

  async delete(userId: string, id: string) {
    const template = await prisma.template.findFirst({ where: { id, userId } });
    if (!template) throw new NotFoundError('Template');
    await prisma.template.delete({ where: { id } });
    return { message: 'Template deleted' };
  }
}

export const templatesService = new TemplatesService();
