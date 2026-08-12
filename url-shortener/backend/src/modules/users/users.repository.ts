import { PrismaClient } from '@prisma/client';
import { prisma } from '../../config/db';

export const usersRepository = {
  findAll: (page: number, limit: number) =>
    prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    }),

  count: () => prisma.user.count(),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    }),

  update: (id: string, data: { name?: string; role?: 'admin' | 'user' }) =>
    prisma.user.update({ where: { id }, data, select: { id: true, email: true, name: true, role: true } }),

  delete: (id: string) => prisma.user.delete({ where: { id } }),
};
