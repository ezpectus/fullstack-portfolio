import { prisma } from '../../config/db';
import { NotFoundError, BadRequestError } from '../../shared/errors';
import { Role } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export class UsersService {
  async list(page: number, limit: number, search?: string) {
    const where: Prisma.UserWhereInput = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
      : {};
    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, select: { id: true, email: true, name: true, role: true, createdAt: true }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async update(id: string, data: { name?: string; email?: string; role?: Role }) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('User');
    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== id) throw new BadRequestError('Email already in use');
    }
    return prisma.user.update({ where: { id }, data: { name: data.name, email: data.email, role: data.role }, select: { id: true, email: true, name: true, role: true } });
  }

  async delete(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('User');
    await prisma.user.delete({ where: { id } });
    return { message: 'User deleted' };
  }
}

export const usersService = new UsersService();
