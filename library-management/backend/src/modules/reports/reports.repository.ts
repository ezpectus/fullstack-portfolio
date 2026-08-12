import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class ReportsRepository {
  async loanGroupByMember(where: Prisma.LoanWhereInput, take: number) {
    return prisma.loan.groupBy({
      by: ['memberId'],
      _count: true,
      orderBy: { _count: { memberId: 'desc' } },
      take,
      where,
    });
  }

  async findMemberById(id: string, include?: Prisma.MemberInclude) {
    return prisma.member.findUnique({ where: { id }, include });
  }

  async findAllBooks(select?: Prisma.BookSelect) {
    return prisma.book.findMany({ select });
  }

  async findLostDamagedCopies() {
    return prisma.bookCopy.findMany({
      where: { status: { in: ['LOST', 'DAMAGED'] } },
      include: { book: true },
    });
  }

  async findLoansForExport(take: number) {
    return prisma.loan.findMany({
      include: { bookCopy: { include: { book: true } }, member: { include: { user: true } } },
      orderBy: { borrowedAt: 'desc' },
      take,
    });
  }
}

export const reportsRepository = new ReportsRepository();
