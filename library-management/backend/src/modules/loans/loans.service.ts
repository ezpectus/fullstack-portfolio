import { loansRepository } from './loans.repository';
import { bookCopiesRepository } from '../book-copies/book-copies.repository';
import { membersRepository } from '../members/members.repository';
import { Prisma, LoanStatus } from '@prisma/client';
import { env } from '../../config/env';
import { NotFoundError, BadRequestError, ConflictError } from '../../shared/errors';

export class LoansService {
  async list(params: { page: number; limit: number; status?: string; memberId?: string }) {
    const { page, limit, status, memberId } = params;
    const where: Prisma.LoanWhereInput = {};
    if (status) where.status = status as LoanStatus;
    if (memberId) where.memberId = memberId;

    const [items, total] = await Promise.all([
      loansRepository.findMany({
        where,
        include: { bookCopy: { include: { book: true } }, member: { include: { user: true } }, librarian: true, fine: true },
        orderBy: { borrowedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      loansRepository.count(where),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async listMy(params: { page: number; limit: number; status?: string; userId: string }) {
    const { page, limit, status, userId } = params;
    const member = await membersRepository.findByUserId(userId);
    if (!member) throw new NotFoundError('Member profile');

    const where: Prisma.LoanWhereInput = { memberId: member.id };
    if (status) where.status = status as LoanStatus;

    const [items, total] = await Promise.all([
      loansRepository.findMany({
        where,
        include: { bookCopy: { include: { book: true } }, member: { include: { user: true } }, librarian: true, fine: true },
        orderBy: { borrowedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      loansRepository.count(where),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(id: string) {
    const loan = await loansRepository.findById(id, { bookCopy: { include: { book: true } }, member: { include: { user: true } }, librarian: true, fine: true });
    if (!loan) throw new NotFoundError('Loan');
    return loan;
  }

  async create(data: { bookCopyId: string; memberId: string; dueDate?: string }, librarianId: string) {
    const copy = await bookCopiesRepository.findById(data.bookCopyId);
    if (!copy) throw new NotFoundError('Book copy');
    if (copy.status !== 'AVAILABLE') throw new ConflictError('Book copy is not available');

    const member = await membersRepository.findById(data.memberId);
    if (!member) throw new NotFoundError('Member');
    if (member.status !== 'ACTIVE') throw new BadRequestError('Member is not active');

    const dueDate = data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + env.loanPeriodDays * 86400000);

    const [loan] = await loansRepository.transaction([
      loansRepository.createTx(
        { bookCopyId: data.bookCopyId, memberId: data.memberId, librarianId, dueDate },
        { bookCopy: { include: { book: true } }, member: { include: { user: true } } },
      ),
      loansRepository.updateBookCopyStatusTx(data.bookCopyId, 'BORROWED'),
    ]);

    return loan;
  }

  async returnBook(id: string) {
    const loan = await loansRepository.findById(id, { bookCopy: true });
    if (!loan) throw new NotFoundError('Loan');
    if (loan.status === 'RETURNED') throw new BadRequestError('Book already returned');

    const now = new Date();
    const isOverdue = now > loan.dueDate;

    if (isOverdue) {
      const daysLate = Math.ceil((now.getTime() - loan.dueDate.getTime()) / 86400000);
      const amount = daysLate * env.finePerDay;

      await loansRepository.transaction([
        loansRepository.createFineTx({ loanId: id, memberId: loan.memberId, amount, reason: `Overdue by ${daysLate} days` }),
        loansRepository.updateTx(id, { status: 'RETURNED', returnedAt: now }),
        loansRepository.updateBookCopyStatusTx(loan.bookCopyId, 'AVAILABLE'),
      ]);
    } else {
      await loansRepository.transaction([
        loansRepository.updateTx(id, { status: 'RETURNED', returnedAt: now }),
        loansRepository.updateBookCopyStatusTx(loan.bookCopyId, 'AVAILABLE'),
      ]);
    }

    return loansRepository.findById(id, { bookCopy: { include: { book: true } }, member: { include: { user: true } }, fine: true });
  }

  async renew(id: string) {
    const loan = await loansRepository.findForRenew(id);
    if (!loan) throw new NotFoundError('Loan');
    if (loan.status === 'RETURNED') throw new BadRequestError('Cannot renew a returned loan');
    if (loan.renewals >= env.maxRenewals) throw new BadRequestError('Maximum renewals reached');

    const reservations = await loansRepository.findPendingReservations(loan.bookCopy.bookId);
    if (reservations.length > 0) throw new BadRequestError('Cannot renew: book has pending reservations');

    const newDueDate = new Date(loan.dueDate.getTime() + env.loanPeriodDays * 86400000);
    return loansRepository.update(id, { dueDate: newDueDate, renewals: { increment: 1 } }, { bookCopy: { include: { book: true } }, member: { include: { user: true } } });
  }
}

export const loansService = new LoansService();
