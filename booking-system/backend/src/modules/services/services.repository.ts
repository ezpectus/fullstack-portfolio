import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';
import type { Service } from '@prisma/client';

export class ServicesRepository {
  async findMany(params: {
    skip: number;
    limit: number;
    search?: string;
    status?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const where: Prisma.ServiceWhereInput = {};
    if (params.search)
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    if (params.status === 'active') where.isActive = true;
    if (params.status === 'inactive') where.isActive = false;
    if (params.categoryId) where.categoryId = params.categoryId;
    const orderBy: Prisma.ServiceOrderByWithRelationInput = params.sortBy
      ? { [params.sortBy]: params.sortOrder || 'asc' }
      : { createdAt: 'desc' };
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip: params.skip,
        take: params.limit,
        orderBy,
        include: { category: true, providers: { include: { provider: true } } },
      }),
      prisma.service.count({ where }),
    ]);
    return { services, total };
  }

  async findById(id: string): Promise<Service | null> {
    return prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        providers: { include: { provider: { include: { user: { select: { id: true, name: true } } } } } },
        bookings: { take: 10, orderBy: { startTime: 'desc' } },
      },
    });
  }

  async create(data: { name: string; description?: string; duration: number; price: number; isActive?: boolean; categoryId?: string | null }): Promise<Service> {
    const { categoryId, ...rest } = data;
    return prisma.service.create({ data: { ...rest, category: categoryId ? { connect: { id: categoryId } } : undefined }, include: { category: true } });
  }

  async update(id: string, data: { name?: string; description?: string; duration?: number; price?: number; isActive?: boolean; categoryId?: string | null }): Promise<Service> {
    const { categoryId, ...rest } = data;
    return prisma.service.update({ where: { id }, data: { ...rest, category: categoryId ? { connect: { id: categoryId } } : categoryId === null ? { disconnect: true } : undefined }, include: { category: true } });
  }

  async delete(id: string): Promise<void> {
    await prisma.service.delete({ where: { id } });
  }
}

export const servicesRepository = new ServicesRepository();
