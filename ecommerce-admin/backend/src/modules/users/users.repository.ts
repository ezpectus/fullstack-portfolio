import { prisma } from '../../config/db';
import type { User } from '@prisma/client';

export class UsersRepository {
  async findMany(params: { skip: number; limit: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const where: any = params.search
      ? { OR: [{ name: { contains: params.search, mode: 'insensitive' } }, { email: { contains: params.search, mode: 'insensitive' } }] }
      : {};
    const orderBy: any = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' };
    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip: params.skip, take: params.limit, orderBy, select: { id: true, email: true, name: true, role: true, createdAt: true } }),
      prisma.user.count({ where }),
    ]);
    return { users, total };
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<{ name: string; email: string; role: string }>): Promise<User> {
    return prisma.user.update({ where: { id }, data: data as any });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}

export const usersRepository = new UsersRepository();
