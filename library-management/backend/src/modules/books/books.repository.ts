import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class BooksRepository {
  async findMany(params: {
    where: Prisma.BookWhereInput;
    include?: Prisma.BookInclude;
    orderBy?: Prisma.BookOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.book.findMany({
      where: params.where,
      include: params.include,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    });
  }

  async count(where: Prisma.BookWhereInput) {
    return prisma.book.count({ where });
  }

  async findById(id: string, include?: Prisma.BookInclude) {
    return prisma.book.findUnique({ where: { id }, include });
  }

  async findByIsbn(isbn: string) {
    return prisma.book.findUnique({ where: { isbn } });
  }

  async create(data: Prisma.BookCreateInput, include?: Prisma.BookInclude) {
    return prisma.book.create({ data, include });
  }

  async update(id: string, data: Prisma.BookUpdateInput, include?: Prisma.BookInclude) {
    return prisma.book.update({ where: { id }, data, include });
  }

  async delete(id: string) {
    return prisma.book.delete({ where: { id } });
  }
}

export const booksRepository = new BooksRepository();
