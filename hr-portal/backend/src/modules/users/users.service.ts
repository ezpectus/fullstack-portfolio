import usersRepository from './users.repository';
import { NotFoundError } from '../../shared/errors';

export class UsersService {
  async list(params: { page?: number; limit?: number; search?: string; role?: string }) {
    return usersRepository.findMany(params);
  }

  async getById(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  async update(id: string, data: any) {
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

export default new UsersService();
