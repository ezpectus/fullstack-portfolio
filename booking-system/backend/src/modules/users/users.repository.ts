import { prisma } from '../../config/db';
import { Prisma, Role } from '@prisma/client';

export class UsersRepository {
  async findMany(params: { skip: number; limit: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const where: Prisma.UserWhereInput = params.search
      ? { OR: [{ name: { contains: params.search, mode: 'insensitive' as const } }, { email: { contains: params.search, mode: 'insensitive' as const } }] }
      : {};
    const orderBy: Prisma.UserOrderByWithRelationInput = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' };
    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip: params.skip, take: params.limit, orderBy, select: { id: true, email: true, name: true, role: true, createdAt: true } }),
      prisma.user.count({ where }),
    ]);
    return { users, total };
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
  }

  async update(id: string, data: { name?: string; email?: string; role?: string }) {
    const updateData: Prisma.UserUpdateInput = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role as Role;
    return prisma.user.update({ where: { id }, data: updateData, select: { id: true, email: true, name: true, role: true, createdAt: true } });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export const usersRepository = new UsersRepository();
