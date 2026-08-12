import { usersRepository } from './users.repository';
import { NotFoundError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';

export class UsersService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { users, total } = await usersRepository.findMany({ skip, limit, search: query.search, sortBy: query.sortBy, sortOrder: query.sortOrder });
    return { data: users, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async update(id: string, data: { name?: string; email?: string; role?: string }) {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    return usersRepository.update(id, data);
  }

  async delete(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    return usersRepository.delete(id);
  }
}

export const usersService = new UsersService();
