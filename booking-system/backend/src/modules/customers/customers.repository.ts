import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class CustomersRepository {
  async findMany(params: { skip: number; limit: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const where = params.search
      ? { OR: [{ name: { contains: params.search, mode: 'insensitive' as const } }, { email: { contains: params.search, mode: 'insensitive' as const } }, { phone: { contains: params.search } }] }
      : {};
    const orderBy: Prisma.CustomerOrderByWithRelationInput = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' };
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, skip: params.skip, take: params.limit, orderBy, include: { _count: { select: { bookings: true } } } }),
      prisma.customer.count({ where }),
    ]);
    return { customers, total };
  }

  async findById(id: string) {
    return prisma.customer.findUnique({ where: { id }, include: { bookings: { include: { service: true, provider: { include: { user: { select: { name: true } } } } }, orderBy: { startTime: 'desc' } } } });
  }

  async create(data: { name: string; email: string; phone?: string; notes?: string }) {
    return prisma.customer.create({ data });
  }

  async update(id: string, data: { name?: string; email?: string; phone?: string; notes?: string }) {
    return prisma.customer.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.customer.delete({ where: { id } });
  }
}

export const customersRepository = new CustomersRepository();
