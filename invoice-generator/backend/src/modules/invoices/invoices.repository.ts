import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class InvoicesRepository {
  async findMany(params: {
    where: Prisma.InvoiceWhereInput;
    skip: number;
    take: number;
    orderBy: Prisma.InvoiceOrderByWithRelationInput;
    include?: Prisma.InvoiceInclude;
  }) {
    return prisma.invoice.findMany({
      where: params.where,
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy,
      include: params.include,
    });
  }

  async count(where: Prisma.InvoiceWhereInput) {
    return prisma.invoice.count({ where });
  }

  async findFirst(where: Prisma.InvoiceWhereInput, include?: Prisma.InvoiceInclude) {
    return prisma.invoice.findFirst({ where, include });
  }

  async findById(id: string, include?: Prisma.InvoiceInclude) {
    return prisma.invoice.findUnique({ where: { id }, include });
  }

  async create(data: Prisma.InvoiceUncheckedCreateInput, include?: Prisma.InvoiceInclude) {
    return prisma.invoice.create({ data, include });
  }

  async update(id: string, data: Prisma.InvoiceUpdateInput, include?: Prisma.InvoiceInclude) {
    return prisma.invoice.update({ where: { id }, data, include });
  }

  async delete(id: string) {
    return prisma.invoice.delete({ where: { id } });
  }

  async findCompanyByUserId(userId: string) {
    return prisma.company.findUnique({ where: { userId } });
  }

  async findClientById(id: string, userId: string) {
    return prisma.client.findFirst({ where: { id, userId } });
  }

  async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return prisma.$transaction(fn);
  }
}

export const invoicesRepository = new InvoicesRepository();
