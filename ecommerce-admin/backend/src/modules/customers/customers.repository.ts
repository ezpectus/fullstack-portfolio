import { prisma } from '../../config/db';
import type { Customer } from '@prisma/client';

export class CustomersRepository {
  async findMany(params: { skip: number; limit: number; search?: string; status?: string; segment?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const where: any = {};
    if (params.search) where.OR = [{ name: { contains: params.search, mode: 'insensitive' } }, { email: { contains: params.search, mode: 'insensitive' } }];
    if (params.status) where.status = params.status;
    if (params.segment) where.segment = params.segment;
    const orderBy: any = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' };
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, skip: params.skip, take: params.limit, orderBy, include: { _count: { select: { orders: true } } } }),
      prisma.customer.count({ where }),
    ]);
    return { customers, total };
  }

  async findById(id: string) {
    return prisma.customer.findUnique({ where: { id }, include: { addresses: true, orders: { include: { items: true }, orderBy: { createdAt: 'desc' } } } });
  }

  async create(data: any): Promise<Customer> {
    return prisma.customer.create({ data, include: { addresses: true } });
  }

  async update(id: string, data: any): Promise<Customer> {
    return prisma.customer.update({ where: { id }, data, include: { addresses: true } });
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.delete({ where: { id } });
  }
}

export const customersRepository = new CustomersRepository();
