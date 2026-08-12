import { invoicesRepository } from './invoices.repository';
import { NotFoundError, BadRequestError } from '../../shared/errors';
import { InvoiceItemInput } from './invoices.dto';
import { InvoiceStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { VALID_STATUS_TRANSITIONS } from '../../shared/constants';

function calculateItemTotal(item: InvoiceItemInput): number {
  const lineTotal = item.quantity * item.unitPrice;
  const afterDiscount = lineTotal - item.discount;
  const taxAmount = afterDiscount * (item.taxRate / 100);
  return Math.round((afterDiscount + taxAmount) * 100) / 100;
}

function calculateInvoiceTotals(items: InvoiceItemInput[]) {
  let subtotal = 0;
  let taxTotal = 0;
  let discountTotal = 0;

  for (const item of items) {
    const lineTotal = item.quantity * item.unitPrice;
    subtotal += lineTotal;
    discountTotal += item.discount;
    const afterDiscount = lineTotal - item.discount;
    taxTotal += afterDiscount * (item.taxRate / 100);
  }

  const total = subtotal - discountTotal + taxTotal;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxTotal: Math.round(taxTotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export class InvoicesService {
  async list(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    status?: InvoiceStatus,
    clientId?: string,
    sortBy?: string,
    sortOrder?: string,
  ) {
    const where: Prisma.InvoiceWhereInput = { userId };
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orderBy: Prisma.InvoiceOrderByWithRelationInput = { [sortBy || 'createdAt']: sortOrder || 'desc' };

    const [items, total] = await Promise.all([
      invoicesRepository.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: { client: { select: { id: true, name: true, email: true } }, items: true },
      }),
      invoicesRepository.count(where),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getById(userId: string, id: string) {
    const invoice = await invoicesRepository.findFirst(
      { id, userId },
      { client: true, items: { orderBy: { id: 'asc' } }, user: { select: { name: true, email: true } } },
    );
    if (!invoice) throw new NotFoundError('Invoice');
    return invoice;
  }

  async create(userId: string, data: Omit<Prisma.InvoiceUncheckedCreateInput, 'userId' | 'number'>) {
    const company = await invoicesRepository.findCompanyByUserId(userId);
    if (!company) throw new BadRequestError('Company profile not set up');

    const client = await invoicesRepository.findClientById(data.clientId, userId);
    if (!client) throw new NotFoundError('Client');

    const number = `${company.invoicePrefix}-${String(company.invoiceStart).padStart(4, '0')}`;
    const itemsInput = data.items as { create: InvoiceItemInput[] };
    const totals = calculateInvoiceTotals(itemsInput.create);

    const invoice = await invoicesRepository.transaction(async (tx) => {
      const created = await tx.invoice.create({
        data: {
          number,
          userId,
          clientId: data.clientId,
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          currency: data.currency || 'USD',
          notes: data.notes,
          subtotal: totals.subtotal,
          taxTotal: totals.taxTotal,
          discountTotal: totals.discountTotal,
          total: totals.total,
          items: {
            create: itemsInput.create.map((item: InvoiceItemInput) => ({
              description: item.description,
              quantity: item.quantity,
              unit: item.unit,
              unitPrice: item.unitPrice,
              taxRate: item.taxRate,
              discount: item.discount,
              total: calculateItemTotal(item),
            })),
          },
        },
        include: { items: true, client: true },
      });

      await tx.company.update({
        where: { userId },
        data: { invoiceStart: { increment: 1 } },
      });

      return created;
    });

    return invoice;
  }

  async update(userId: string, id: string, data: Prisma.InvoiceUpdateInput) {
    const invoice = await invoicesRepository.findFirst({ id, userId });
    if (!invoice) throw new NotFoundError('Invoice');
    if (invoice.status !== 'DRAFT') throw new BadRequestError('Can only edit draft invoices');

    const updated = await invoicesRepository.update(id, data, { items: true, client: true });

    return updated;
  }

  async updateStatus(userId: string, id: string, status: InvoiceStatus) {
    const invoice = await invoicesRepository.findFirst({ id, userId });
    if (!invoice) throw new NotFoundError('Invoice');

    const allowed = VALID_STATUS_TRANSITIONS[invoice.status] || [];
    if (!allowed.includes(status)) {
      throw new BadRequestError(`Cannot transition from ${invoice.status} to ${status}`);
    }

    const data: Prisma.InvoiceUpdateInput = { status };
    if (status === 'PAID') data.paidAt = new Date();
    if (status === 'SENT') data.sentAt = new Date();

    return invoicesRepository.update(id, data, { items: true, client: true });
  }

  async delete(userId: string, id: string) {
    const invoice = await invoicesRepository.findFirst({ id, userId });
    if (!invoice) throw new NotFoundError('Invoice');
    if (invoice.status !== 'DRAFT') throw new BadRequestError('Can only delete draft invoices');
    await invoicesRepository.delete(id);
    return { message: 'Invoice deleted' };
  }
}

export const invoicesService = new InvoicesService();
