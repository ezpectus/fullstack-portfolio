import { prisma } from '../../config/db';
import { Prisma, Loan, BookCopy, Fine } from '@prisma/client';

export class LoansRepository {
  async findMany(params: {
    where: Prisma.LoanWhereInput;
    include?: Prisma.LoanInclude;
    orderBy?: Prisma.LoanOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    return prisma.loan.findMany({
      where: params.where,
      include: params.include,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    });
  }

  async count(where: Prisma.LoanWhereInput) {
    return prisma.loan.count({ where });
  }

  async findById(id: string, include?: Prisma.LoanInclude) {
    return prisma.loan.findUnique({ where: { id }, include });
  }

  async create(data: Prisma.LoanCreateInput, include?: Prisma.LoanInclude) {
    return prisma.loan.create({ data, include });
  }

  async update(id: string, data: Prisma.LoanUpdateInput, include?: Prisma.LoanInclude) {
    return prisma.loan.update({ where: { id }, data, include });
  }

  async transaction(operations: Prisma.PrismaPromise<unknown>[]) {
    return prisma.$transaction(operations as [Prisma.PrismaPromise<unknown>, ...Prisma.PrismaPromise<unknown>[]]);
  }

  async findForRenew(id: string) {
    return prisma.loan.findUnique({ where: { id }, include: { bookCopy: true } });
  }

  async findPendingReservations(bookId: string) {
    return prisma.reservation.findMany({ where: { bookId, status: 'PENDING' } });
  }

  createTx(data: Prisma.LoanUncheckedCreateInput, include?: Prisma.LoanInclude): Prisma.PrismaPromise<Prisma.LoanGetPayload<{ include?: Prisma.LoanInclude }>> {
    return prisma.loan.create({ data, include });
  }

  updateTx(id: string, data: Prisma.LoanUpdateInput): Prisma.PrismaPromise<Loan> {
    return prisma.loan.update({ where: { id }, data });
  }

  updateBookCopyStatusTx(id: string, status: Prisma.BookCopyUpdateInput['status']): Prisma.PrismaPromise<BookCopy> {
    return prisma.bookCopy.update({ where: { id }, data: { status } });
  }

  createFineTx(data: Prisma.FineUncheckedCreateInput): Prisma.PrismaPromise<Fine> {
    return prisma.fine.create({ data });
  }
}

export const loansRepository = new LoansRepository();
