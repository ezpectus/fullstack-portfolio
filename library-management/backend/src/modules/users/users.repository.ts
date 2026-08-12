import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class UsersRepository {
  async findMany(params: {
    where: Prisma.UserWhereInput;
    select?: Prisma.UserSelect;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.user.findMany({
      where: params.where,
      select: params.select,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    });
  }

  async count(where: Prisma.UserWhereInput) {
    return prisma.user.count({ where });
  }

  async findById(id: string, select?: Prisma.UserSelect) {
    return prisma.user.findUnique({ where: { id }, select });
  }

  async update(id: string, data: Prisma.UserUpdateInput, select?: Prisma.UserSelect) {
    return prisma.user.update({ where: { id }, data, select });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export const usersRepository = new UsersRepository();
