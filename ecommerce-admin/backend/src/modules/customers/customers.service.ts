import { customersRepository } from './customers.repository';
import { NotFoundError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';
import type { CreateCustomerInput, UpdateCustomerInput } from './customers.dto';

export class CustomersService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { customers, total } = await customersRepository.findMany({
      skip,
      limit,
      search: query.search,
      status: query.status,
      segment: query.segment,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
    return { data: customers, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const customer = await customersRepository.findById(id);
    if (!customer) throw new NotFoundError('Customer');
    return customer;
  }

  async create(input: CreateCustomerInput) {
    return customersRepository.create({
      ...input,
      addresses: input.addresses ? { create: input.addresses } : undefined,
    });
  }

  async update(id: string, input: UpdateCustomerInput) {
    const customer = await customersRepository.findById(id);
    if (!customer) throw new NotFoundError('Customer');
    return customersRepository.update(id, input);
  }

  async delete(id: string) {
    const customer = await customersRepository.findById(id);
    if (!customer) throw new NotFoundError('Customer');
    await customersRepository.delete(id);
  }
}

export const customersService = new CustomersService();
