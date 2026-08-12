import { booksRepository } from './books.repository';
import { NotFoundError, ConflictError } from '../../shared/errors';
import type { Prisma } from '@prisma/client';

export class BooksService {
  async list(params: { page: number; limit: number; search?: string; genre?: string; categoryId?: string; sortBy: string; sortOrder: string }) {
    const { page, limit, search, genre, categoryId, sortBy, sortOrder } = params;
    const where: Prisma.BookWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { authors: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (genre) where.genre = { contains: genre, mode: 'insensitive' };
    if (categoryId) where.categoryId = categoryId;

    const include = { category: true, _count: { select: { copies: true } } };

    const [items, total] = await Promise.all([
      booksRepository.findMany({
        where,
        include,
        orderBy: { [sortBy]: sortOrder } as Prisma.BookOrderByWithRelationInput,
        skip: (page - 1) * limit,
        take: limit,
      }),
      booksRepository.count(where),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string) {
    const book = await booksRepository.findById(id, {
      category: true,
      copies: true,
      reservations: { where: { status: 'PENDING' }, include: { member: { include: { user: true } } } },
    });
    if (!book) throw new NotFoundError('Book');
    return book;
  }

  async create(data: Prisma.BookCreateInput) {
    const existing = await booksRepository.findByIsbn(data.isbn);
    if (existing) throw new ConflictError('ISBN already exists');
    return booksRepository.create(data, { category: true });
  }

  async update(id: string, data: Prisma.BookUpdateInput) {
    const book = await booksRepository.findById(id);
    if (!book) throw new NotFoundError('Book');
    return booksRepository.update(id, data, { category: true });
  }

  async delete(id: string) {
    const book = await booksRepository.findById(id);
    if (!book) throw new NotFoundError('Book');
    await booksRepository.delete(id);
  }
}

export const booksService = new BooksService();
