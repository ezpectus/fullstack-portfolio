import { usersRepository } from './users.repository';
import { NotFoundError, BadRequestError } from '../../shared/errors';

export const usersService = {
  list: async (page: number, limit: number) => {
    const [users, total] = await Promise.all([usersRepository.findAll(page, limit), usersRepository.count()]);
    return {
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getById: async (id: string) => {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  },

  update: async (id: string, data: { name?: string; role?: 'admin' | 'user' }) => {
    if (data.role && !['admin', 'user'].includes(data.role)) {
      throw new BadRequestError('Invalid role');
    }
    return usersRepository.update(id, data);
  },

  delete: async (id: string) => {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    await usersRepository.delete(id);
    return { message: 'User deleted successfully' };
  },
};
