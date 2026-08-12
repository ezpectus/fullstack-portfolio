import { customersRepository } from './customers.repository';
import { NotFoundError, ForbiddenError } from '../../shared/errors';
import { ROLES } from '../../shared/constants';
import { parseTags } from '../../shared/utils';
import { prisma } from '../../config/db';
import { CustomerStatus } from '@prisma/client';
import type { CreateCustomerInput, UpdateCustomerInput } from './customers.dto';
import type { Prisma } from '@prisma/client';
import type { AuthPayload } from '../../shared/types';

export class CustomersService {
  async list(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    tags?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    user: AuthPayload;
  }) {
    const skip = (params.page - 1) * params.limit;

    const where: Prisma.CustomerWhereInput = {};

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { company: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { phone: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.status) {
      where.status = params.status as CustomerStatus;
    }

    const tags = parseTags(params.tags);
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    if (params.user.role === ROLES.SALES_REP) {
      where.assignedToId = params.user.userId;
    }

    const orderBy: Prisma.CustomerOrderByWithRelationInput = params.sortBy
      ? { [params.sortBy]: params.sortOrder ?? 'desc' }
      : { createdAt: 'desc' };

    const { data, total } = await customersRepository.findMany({
      skip,
      take: params.limit,
      where,
      orderBy,
    });

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
    const customer = await customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer', id);
    }

    if (user.role === ROLES.SALES_REP && customer.assignedToId !== user.userId) {
      throw new ForbiddenError('You can only view customers assigned to you');
    }

    return customer;
  }

  async create(input: CreateCustomerInput, user: AuthPayload) {
    const data: Prisma.CustomerCreateInput = {
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      status: input.status ?? 'lead',
      tags: input.tags ?? [],
      avatar: input.avatar,
    };

    if (input.assignedToId) {
      data.assignedTo = { connect: { id: input.assignedToId } };
    } else if (user.role === ROLES.SALES_REP) {
      data.assignedTo = { connect: { id: user.userId } };
    }

    return customersRepository.create(data);
  }

  async update(id: string, input: UpdateCustomerInput, user: AuthPayload) {
    const customer = await customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer', id);
    }

    if (user.role === ROLES.SALES_REP && customer.assignedToId !== user.userId) {
      throw new ForbiddenError('You can only update customers assigned to you');
    }

    const data: Prisma.CustomerUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.company !== undefined) data.company = input.company;
    if (input.email !== undefined) data.email = input.email;
    if (input.phone !== undefined) data.phone = input.phone;
    if (input.status !== undefined) data.status = input.status;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.avatar !== undefined) data.avatar = input.avatar;
    if (input.assignedToId !== undefined) {
      data.assignedTo = { connect: { id: input.assignedToId } };
    }

    return customersRepository.update(id, data);
  }

  async delete(id: string, user: AuthPayload) {
    const customer = await customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer', id);
    }

    if (user.role === ROLES.SALES_REP && customer.assignedToId !== user.userId) {
      throw new ForbiddenError('You can only delete customers assigned to you');
    }

    await customersRepository.delete(id);
  }

  async getTimeline(id: string, user: AuthPayload) {
    const customer = await customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer', id);
    }

    if (user.role === ROLES.SALES_REP && customer.assignedToId !== user.userId) {
      throw new ForbiddenError('You can only view timeline for customers assigned to you');
    }

    return customersRepository.findTimeline(id);
  }

  async exportToCSV(user: AuthPayload): Promise<string> {
    const where: Prisma.CustomerWhereInput = {};
    if (user.role === ROLES.SALES_REP) {
      where.assignedToId = user.userId;
    }

    const customers = await customersRepository.findAllForExport(where);

    const headers = ['Name', 'Company', 'Email', 'Phone', 'Status', 'Tags', 'Assigned To', 'Created At'];
    const rows = customers.map((c) => [
      c.name,
      c.company ?? '',
      c.email ?? '',
      c.phone ?? '',
      c.status,
      c.tags.join(';'),
      c.assignedTo?.name ?? '',
      c.createdAt.toISOString(),
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

export const customersService = new CustomersService();
