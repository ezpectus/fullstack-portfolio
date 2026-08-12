import { usersRepository } from './users.repository';
import { NotFoundError, ConflictError } from '../../shared/errors';
import type { UpdateUserInput } from './users.dto';
import type { Prisma } from '@prisma/client';

export class UsersService {
  async list(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await usersRepository.findMany({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async getById(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }
    return user;
  }

  async update(id: string, input: UpdateUserInput) {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }

    if (input.email && input.email !== user.email) {
      const existing = await usersRepository.findByEmail(input.email);
      if (existing) {
        throw new ConflictError('Email already in use');
      }
    }

    return usersRepository.update(id, input);
  }

  async delete(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User', id);
    }
    await usersRepository.delete(id);
  }
}

export const usersService = new UsersService();
