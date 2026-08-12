import { providersRepository } from './providers.repository';
import { NotFoundError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';

export class ProvidersService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const isActive = query.isActive !== undefined ? query.isActive === 'true' : undefined;
    const { providers, total } = await providersRepository.findMany({ skip, limit, search: query.search, isActive, serviceId: query.serviceId, sortBy: query.sortBy, sortOrder: query.sortOrder });
    return { data: providers, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const provider = await providersRepository.findById(id);
    if (!provider) throw new NotFoundError('Provider');
    return provider;
  }

  async create(input: { userId: string; bio?: string; isActive?: boolean; serviceIds?: string[]; workingHours?: { dayOfWeek: number; startTime: string; endTime: string; isBreak?: boolean }[] }) {
    const { serviceIds, workingHours, ...providerData } = input;
    const provider = await providersRepository.create(providerData);
    if (serviceIds) await providersRepository.setServices(provider.id, serviceIds);
    if (workingHours) await providersRepository.setWorkingHours(provider.id, workingHours);
    return providersRepository.findById(provider.id);
  }

  async update(id: string, input: { bio?: string; isActive?: boolean; serviceIds?: string[]; workingHours?: { dayOfWeek: number; startTime: string; endTime: string; isBreak?: boolean }[] }) {
    const provider = await providersRepository.findById(id);
    if (!provider) throw new NotFoundError('Provider');
    const { serviceIds, workingHours, ...updateData } = input;
    if (Object.keys(updateData).length > 0) await providersRepository.update(id, updateData);
    if (serviceIds) await providersRepository.setServices(id, serviceIds);
    if (workingHours) await providersRepository.setWorkingHours(id, workingHours);
    return providersRepository.findById(id);
  }

  async delete(id: string) {
    const provider = await providersRepository.findById(id);
    if (!provider) throw new NotFoundError('Provider');
    return providersRepository.delete(id);
  }
}

export const providersService = new ProvidersService();
