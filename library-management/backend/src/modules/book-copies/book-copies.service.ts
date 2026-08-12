import { bookCopiesRepository } from './book-copies.repository';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { BookCopyStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export class BookCopiesService {
  async list(params: { page: number; limit: number; bookId?: string; status?: BookCopyStatus }) {
    const { page, limit, bookId, status } = params;
    const where: Prisma.BookCopyWhereInput = {};
    if (bookId) where.bookId = bookId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      bookCopiesRepository.findMany({
        where,
        include: { book: true },
        orderBy: { acquiredAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      bookCopiesRepository.count(where),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string) {
    const copy = await bookCopiesRepository.findById(id, { book: true });
    if (!copy) throw new NotFoundError('Book copy');
    return copy;
  }

  async create(data: { bookId: string; code: string; condition?: string }) {
    const existing = await bookCopiesRepository.findByCode(data.code);
    if (existing) throw new ConflictError('Copy code already exists');
    return bookCopiesRepository.create({
      book: { connect: { id: data.bookId } },
      code: data.code,
      condition: data.condition,
    }, { book: true });
  }

  async update(id: string, data: { status?: BookCopyStatus; condition?: string }) {
    const copy = await bookCopiesRepository.findById(id);
    if (!copy) throw new NotFoundError('Book copy');
    return bookCopiesRepository.update(id, data, { book: true });
  }

  async delete(id: string) {
    const copy = await bookCopiesRepository.findById(id);
    if (!copy) throw new NotFoundError('Book copy');
    await bookCopiesRepository.delete(id);
  }
}

export const bookCopiesService = new BookCopiesService();
