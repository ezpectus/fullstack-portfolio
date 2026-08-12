import { prisma } from '../../config/db';
import type { PromoCode } from '@prisma/client';

export class PromoCodesRepository {
  async findMany(params: { skip: number; limit: number; search?: string; isActive?: string }) {
    const where: any = {};
    if (params.search) where.code = { contains: params.search, mode: 'insensitive' };
    if (params.isActive !== undefined) where.isActive = params.isActive === 'true';
    const [codes, total] = await Promise.all([
      prisma.promoCode.findMany({ where, skip: params.skip, take: params.limit, include: { _count: { select: { orders: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.promoCode.count({ where }),
    ]);
    return { codes, total };
  }

  async findById(id: string): Promise<PromoCode | null> {
    return prisma.promoCode.findUnique({ where: { id }, include: { orders: { select: { id: true, orderNumber: true, total: true, createdAt: true } } } });
  }

  async create(data: any): Promise<PromoCode> {
    return prisma.promoCode.create({ data });
  }

  async update(id: string, data: any): Promise<PromoCode> {
    return prisma.promoCode.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.promoCode.delete({ where: { id } });
  }
}

export const promoCodesRepository = new PromoCodesRepository();
