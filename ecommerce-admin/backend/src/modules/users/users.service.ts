import { usersRepository } from './users.repository';
import { NotFoundError } from '../../shared/errors';
import { parsePagination, buildPaginationMeta } from '../../shared/utils';
import type { RequestQuery } from '../../shared/types';
import type { UpdateUserInput } from './users.dto';

export class UsersService {
  async list(query: RequestQuery) {
    const { page, limit, skip } = parsePagination(query);
    const { users, total } = await usersRepository.findMany({
      skip,
      limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });
    return { data: users, pagination: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, input: UpdateUserInput) {
    const user = await usersRepository.update(id, input);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async delete(id: string) {
    await usersRepository.delete(id);
  }
}

export const usersService = new UsersService();
