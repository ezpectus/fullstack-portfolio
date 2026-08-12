import { userRepository } from './users.repository';
import type { CreateUserInput, UpdateUserInput } from './users.dto';

export class UserService {
  async list(page: number, limit: number, search?: string) {
    return userRepository.findMany(page, limit, search);
  }

  async getById(id: string) {
    return userRepository.findById(id);
  }

  async create(data: CreateUserInput) {
    return userRepository.create(data);
  }

  async update(id: string, data: UpdateUserInput) {
    return userRepository.update(id, data);
  }

  async delete(id: string) {
    return userRepository.delete(id);
  }
}

export const userService = new UserService();
