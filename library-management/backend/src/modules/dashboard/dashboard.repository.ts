import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class DashboardRepository {
  async countBooks() {
    return prisma.book.count();
  }

  async countBookCopies() {
    return prisma.bookCopy.count();
  }

  async countActiveMembers() {
    return prisma.member.count({ where: { status: 'ACTIVE' } });
  }

  async countActiveLoans() {
    return prisma.loan.count({ where: { status: 'ACTIVE' } });
  }

  async countOverdueLoans() {
    return prisma.loan.count({ where: { status: 'OVERDUE' } });
  }

  async countPendingFines() {
    return prisma.fine.count({ where: { status: 'PENDING' } });
  }

  async countPendingReservations() {
    return prisma.reservation.count({ where: { status: 'PENDING' } });
  }

  async countLoansSince(date: Date) {
    return prisma.loan.count({ where: { borrowedAt: { gte: date } } });
  }

  async countLoansByRange(start: Date, end: Date) {
    return prisma.loan.count({ where: { borrowedAt: { gte: start, lt: end } } });
  }

  async sumPendingFines() {
    return prisma.fine.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true },
    });
  }

  async groupPopularBooks(take: number) {
    return prisma.loan.groupBy({
      by: ['bookCopyId'],
      _count: true,
      orderBy: { _count: { bookCopyId: 'desc' } },
      take,
    });
  }

  async findBookCopyById(id: string, include?: Prisma.BookCopyInclude) {
    return prisma.bookCopy.findUnique({ where: { id }, include: include ?? undefined });
  }
}

export const dashboardRepository = new DashboardRepository();
