import departmentsRepository from './departments.repository';
import { AppError } from '../../middleware/errorHandler';

export class DepartmentsService {
  async list(query: { page: number; limit: number; search?: string }) {
    return departmentsRepository.findMany(query);
  }

  async getById(id: string) {
    const dept = await departmentsRepository.findById(id);
    if (!dept) throw new AppError('Department not found', 404);
    return dept;
  }

  async create(data: any) {
    return departmentsRepository.create(data);
  }

  async update(id: string, data: any) {
    const dept = await departmentsRepository.findById(id);
    if (!dept) throw new AppError('Department not found', 404);
    return departmentsRepository.update(id, data);
  }

  async delete(id: string) {
    const dept = await departmentsRepository.findById(id);
    if (!dept) throw new AppError('Department not found', 404);
    return departmentsRepository.delete(id);
  }
}

export default new DepartmentsService();
