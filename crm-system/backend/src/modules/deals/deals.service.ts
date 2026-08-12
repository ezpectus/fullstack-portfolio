import { dealsRepository } from './deals.repository';
import { customersRepository } from '../customers/customers.repository';
import { NotFoundError, ForbiddenError } from '../../shared/errors';
import { ROLES } from '../../shared/constants';
import { DealStage } from '@prisma/client';
import type { CreateDealInput, UpdateDealInput } from './deals.dto';
import type { Prisma } from '@prisma/client';
import type { AuthPayload } from '../../shared/types';

export class DealsService {
  async list(params: {
    page: number;
    limit: number;
    search?: string;
    stage?: string;
    customerId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    user: AuthPayload;
  }) {
    const skip = (params.page - 1) * params.limit;
    const where: Prisma.DealWhereInput = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { customer: { name: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    if (params.stage) {
      where.stage = params.stage as DealStage;
    }

    if (params.customerId) {
      where.customerId = params.customerId;
    }

    if (params.user.role === ROLES.SALES_REP) {
      where.assignedToId = params.user.userId;
    }

    const orderBy: Prisma.DealOrderByWithRelationInput = params.sortBy
      ? { [params.sortBy]: params.sortOrder ?? 'desc' }
      : { createdAt: 'desc' };

    const { data, total } = await dealsRepository.findMany({ skip, take: params.limit, where, orderBy });

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit) || 1,
      },
    };
  }

  async getById(id: string, user: AuthPayload) {
    const deal = await dealsRepository.findById(id);
    if (!deal) {
      throw new NotFoundError('Deal', id);
    }

    if (user.role === ROLES.SALES_REP && deal.assignedToId !== user.userId) {
      throw new ForbiddenError('You can only view deals assigned to you');
    }

    return deal;
  }

  async create(input: CreateDealInput, user: AuthPayload) {
    const customer = await customersRepository.findById(input.customerId);
    if (!customer) {
      throw new NotFoundError('Customer', input.customerId);
    }

    const data: Prisma.DealCreateInput = {
      title: input.title,
      amount: input.amount,
      currency: input.currency,
      stage: input.stage,
      probability: input.probability,
      expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : undefined,
      customer: { connect: { id: input.customerId } },
    };

    if (input.assignedToId) {
      data.assignedTo = { connect: { id: input.assignedToId } };
    } else if (user.role === ROLES.SALES_REP) {
      data.assignedTo = { connect: { id: user.userId } };
    }

    return dealsRepository.create(data);
  }

  async update(id: string, input: UpdateDealInput, user: AuthPayload) {
    const deal = await dealsRepository.findById(id);
    if (!deal) {
      throw new NotFoundError('Deal', id);
    }

    if (user.role === ROLES.SALES_REP && deal.assignedToId !== user.userId) {
      throw new ForbiddenError('You can only update deals assigned to you');
    }

    const data: Prisma.DealUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.amount !== undefined) data.amount = input.amount;
    if (input.currency !== undefined) data.currency = input.currency;
    if (input.stage !== undefined) data.stage = input.stage;
    if (input.probability !== undefined) data.probability = input.probability;
    if (input.expectedCloseDate !== undefined) {
      data.expectedCloseDate = input.expectedCloseDate ? new Date(input.expectedCloseDate) : null;
    }
    if (input.assignedToId !== undefined) {
      data.assignedTo = { connect: { id: input.assignedToId } };
    }

    return dealsRepository.update(id, data);
  }

  async delete(id: string, user: AuthPayload) {
    const deal = await dealsRepository.findById(id);
    if (!deal) {
      throw new NotFoundError('Deal', id);
    }

    if (user.role === ROLES.SALES_REP && deal.assignedToId !== user.userId) {
      throw new ForbiddenError('You can only delete deals assigned to you');
    }

    await dealsRepository.delete(id);
  }

  async getKanban(user: AuthPayload) {
    const where: Prisma.DealWhereInput = {};
    if (user.role === ROLES.SALES_REP) {
      where.assignedToId = user.userId;
    }
    return dealsRepository.findKanban(where);
  }

  async exportToCSV(user: AuthPayload): Promise<string> {
    const where: Prisma.DealWhereInput = {};
    if (user.role === ROLES.SALES_REP) {
      where.assignedToId = user.userId;
    }

    const deals = await dealsRepository.findAllForExport(where);

    const headers = ['Title', 'Amount', 'Currency', 'Stage', 'Probability', 'Customer', 'Company', 'Assigned To', 'Expected Close', 'Created At'];
    const rows = deals.map((d) => [
      d.title,
      d.amount.toString(),
      d.currency,
      d.stage,
      String(d.probability),
      d.customer?.name ?? '',
      d.customer?.company ?? '',
      d.assignedTo?.name ?? '',
      d.expectedCloseDate?.toISOString() ?? '',
      d.createdAt.toISOString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((field) => {
        const escaped = String(field).replace(/"/g, '""');
        if (/^[=+\-@]/.test(escaped)) {
          return `"'${escaped}"`;
        }
        return `"${escaped}"`;
      }).join(','))
      .join('\n');

    return csv;
  }
}

export const dealsService = new DealsService();
