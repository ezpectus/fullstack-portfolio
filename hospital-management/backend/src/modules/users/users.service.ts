import usersRepository from './users.repository';
import { AppError } from '../../middleware/errorHandler';

export class UsersService {
  async list(query: { page: number; limit: number; role?: string; search?: string }) {
    return usersRepository.findMany(query);
  }

  async getById(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async update(id: string, data: any) {
    const user = await usersRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return usersRepository.update(id, data);
  }

  async delete(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw new AppError('User not found', 404);
    return usersRepository.delete(id);
  }
}

export default new UsersService();
