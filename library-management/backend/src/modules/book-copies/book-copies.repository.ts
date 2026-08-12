import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class BookCopiesRepository {
  async findMany(params: {
    where: Prisma.BookCopyWhereInput;
    include?: Prisma.BookCopyInclude;
    orderBy?: Prisma.BookCopyOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.bookCopy.findMany({
      where: params.where,
      include: params.include,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    });
  }

  async count(where: Prisma.BookCopyWhereInput) {
    return prisma.bookCopy.count({ where });
  }

  async findById(id: string, include?: Prisma.BookCopyInclude) {
    return prisma.bookCopy.findUnique({ where: { id }, include });
  }

  async findByCode(code: string) {
    return prisma.bookCopy.findUnique({ where: { code } });
  }

  async create(data: Prisma.BookCopyCreateInput, include?: Prisma.BookCopyInclude) {
    return prisma.bookCopy.create({ data, include });
  }

  async update(id: string, data: Prisma.BookCopyUpdateInput, include?: Prisma.BookCopyInclude) {
    return prisma.bookCopy.update({ where: { id }, data, include });
  }

  async delete(id: string) {
    return prisma.bookCopy.delete({ where: { id } });
  }
}

export const bookCopiesRepository = new BookCopiesRepository();
