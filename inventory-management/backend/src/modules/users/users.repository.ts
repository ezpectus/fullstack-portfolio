import { prisma } from '../../config/db';
import { NotFoundError, ConflictError } from '../../shared/errors';
import bcrypt from 'bcrypt';
import { env } from '../../config/env';
import type { CreateUserInput, UpdateUserInput } from './users.dto';
import type { Prisma, Role } from '@prisma/client';

export class UserRepository {
  async findMany(page: number, limit: number, search?: string) {
    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    });
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async create(data: CreateUserInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictError('Email already registered');
    const hashed = await bcrypt.hash(data.password, env.bcrypt.saltRounds);
    return prisma.user.create({
      data: { email: data.email, password: hashed, name: data.name, role: data.role as Role },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    });
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('User');
    if (data.email && data.email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing) throw new ConflictError('Email already registered');
    }
    return prisma.user.update({
      where: { id },
      data: { email: data.email, name: data.name, role: data.role as Role },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    });
  }

  async delete(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('User');
    return prisma.user.delete({ where: { id } });
  }
}

export const userRepository = new UserRepository();
