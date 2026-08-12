import { servicesRepository } from './services.repository';
import { NotFoundError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';
import type { CreateServiceInput, UpdateServiceInput } from './services.dto';

export class ServicesService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { services, total } = await servicesRepository.findMany({
      skip,
      limit,
      search: query.search,
      status: query.status,
      categoryId: query.categoryId,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
    return { data: services, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const service = await servicesRepository.findById(id);
    if (!service) throw new NotFoundError('Service');
    return service;
  }

  async create(input: CreateServiceInput) {
    return servicesRepository.create(input);
  }

  async update(id: string, input: UpdateServiceInput) {
    const service = await servicesRepository.findById(id);
    if (!service) throw new NotFoundError('Service');
    return servicesRepository.update(id, input);
  }

  async delete(id: string) {
    const service = await servicesRepository.findById(id);
    if (!service) throw new NotFoundError('Service');
    await servicesRepository.delete(id);
  }
}

export const servicesService = new ServicesService();
