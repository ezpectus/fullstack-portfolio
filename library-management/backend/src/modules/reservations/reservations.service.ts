import { reservationsRepository } from './reservations.repository';
import { membersRepository } from '../members/members.repository';
import { prisma } from '../../config/db';
import { Prisma, ReservationStatus } from '@prisma/client';
import { env } from '../../config/env';
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../../shared/errors';

export const reservationsService = {
  async list(params: { page: number; limit: number; status?: string; memberId?: string }) {
    const { page, limit, status, memberId } = params;
    const where: Prisma.ReservationWhereInput = {};
    if (status) where.status = status as ReservationStatus;
    if (memberId) where.memberId = memberId;

    const [items, total] = await Promise.all([
      reservationsRepository.findMany({
        where,
        include: { book: true, member: { include: { user: true } }, bookCopy: true },
        orderBy: { reservedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      reservationsRepository.count(where),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getById(id: string) {
    const reservation = await reservationsRepository.findById(id, { book: true, member: { include: { user: true } }, bookCopy: true });
    if (!reservation) throw new NotFoundError('Reservation');
    return reservation;
  },

  async create(data: { bookId: string }, userId: string) {
    const member = await membersRepository.findByUserId(userId);
    if (!member) throw new NotFoundError('Member profile');

    const book = await prisma.book.findUnique({ where: { id: data.bookId }, include: { copies: true } });
    if (!book) throw new NotFoundError('Book');

    const availableCopy = book.copies.find((c: { status: string }) => c.status === 'AVAILABLE');
    if (availableCopy) throw new BadRequestError('Book has available copies, no need to reserve');

    const existing = await reservationsRepository.findFirst({ memberId: member.id, bookId: data.bookId, status: 'PENDING' });
    if (existing) throw new ConflictError('You already have a pending reservation for this book');

    return reservationsRepository.create(
      { member: { connect: { id: member.id } }, book: { connect: { id: data.bookId } } },
      { book: true, member: { include: { user: true } } },
    );
  },

  async cancel(id: string, userId: string) {
    const reservation = await prisma.reservation.findUnique({ where: { id }, include: { member: true } });
    if (!reservation) throw new NotFoundError('Reservation');
    if (reservation.status !== 'PENDING') throw new BadRequestError('Cannot cancel non-pending reservation');
    if (reservation.member.userId !== userId) throw new ForbiddenError('You can only cancel your own reservations');

    return reservationsRepository.update(id, { status: 'CANCELLED' });
  },

  async fulfill(id: string, bookCopyId: string) {
    const reservation = await reservationsRepository.findById(id);
    if (!reservation) throw new NotFoundError('Reservation');
    if (reservation.status !== 'PENDING') throw new BadRequestError('Reservation is not pending');

    const expiresAt = new Date(Date.now() + env.reservationExpiryDays * 86400000);
    return reservationsRepository.update(id, { status: 'FULFILLED', bookCopy: { connect: { id: bookCopyId } }, fulfilledAt: new Date(), expiresAt }, { book: true, member: { include: { user: true } }, bookCopy: true });
  },
};
