import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class FinesRepository {
  async findMany(params: {
    where: Prisma.FineWhereInput;
    include?: Prisma.FineInclude;
    orderBy?: Prisma.FineOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.fine.findMany({
      where: params.where,
      include: params.include,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    });
  }

  async count(where: Prisma.FineWhereInput) {
    return prisma.fine.count({ where });
  }

  async findById(id: string, include?: Prisma.FineInclude) {
    return prisma.fine.findUnique({ where: { id }, include });
  }

  async create(data: Prisma.FineCreateInput) {
    return prisma.fine.create({ data });
  }

  async update(id: string, data: Prisma.FineUpdateInput, include?: Prisma.FineInclude) {
    return prisma.fine.update({ where: { id }, data, include });
  }
}

export const finesRepository = new FinesRepository();
