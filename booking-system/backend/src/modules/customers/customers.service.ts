import { customersRepository } from './customers.repository';
import { NotFoundError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';

export class CustomersService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { customers, total } = await customersRepository.findMany({ skip, limit, search: query.search, sortBy: query.sortBy, sortOrder: query.sortOrder });
    return { data: customers, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const customer = await customersRepository.findById(id);
    if (!customer) throw new NotFoundError('Customer');
    return customer;
  }

  async create(data: { name: string; email: string; phone?: string; notes?: string }) {
    return customersRepository.create(data);
  }

  async update(id: string, data: { name?: string; email?: string; phone?: string; notes?: string }) {
    const customer = await customersRepository.findById(id);
    if (!customer) throw new NotFoundError('Customer');
    return customersRepository.update(id, data);
  }

  async delete(id: string) {
    const customer = await customersRepository.findById(id);
    if (!customer) throw new NotFoundError('Customer');
    return customersRepository.delete(id);
  }
}

export const customersService = new CustomersService();
