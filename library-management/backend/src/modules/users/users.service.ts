import { usersRepository } from './users.repository';
import { NotFoundError } from '../../shared/errors';
import { Role } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export const usersService = {
  async list(params: { page: number; limit: number; search?: string; role?: Role }) {
    const { page, limit, search, role } = params;
    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;

    const select = { id: true, email: true, name: true, role: true, createdAt: true };

    const [items, total] = await Promise.all([
      usersRepository.findMany({
        where,
        select,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      usersRepository.count(where),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    const user = await usersRepository.findById(id, { id: true, email: true, name: true, role: true, createdAt: true });
    if (!user) throw new NotFoundError('User');
    return user;
  },

  async update(id: string, data: { name?: string; email?: string; role?: Role }) {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    return usersRepository.update(id, data, { id: true, email: true, name: true, role: true, createdAt: true });
  },

  async delete(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    await usersRepository.delete(id);
    return { message: 'User deleted' };
  },
};
