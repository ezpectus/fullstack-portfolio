import departmentsRepository from './departments.repository';
import { NotFoundError } from '../../shared/errors';

export class DepartmentsService {
  async list(params: { page?: number; limit?: number; search?: string }) {
    return departmentsRepository.findMany(params);
  }

  async getById(id: string) {
    const dept = await departmentsRepository.findById(id);
    if (!dept) throw new NotFoundError('Department');
    return dept;
  }

  async create(data: any) {
    return departmentsRepository.create(data);
  }

  async update(id: string, data: any) {
    const dept = await departmentsRepository.findById(id);
    if (!dept) throw new NotFoundError('Department');
    return departmentsRepository.update(id, data);
  }

  async delete(id: string) {
    const dept = await departmentsRepository.findById(id);
    if (!dept) throw new NotFoundError('Department');
    return departmentsRepository.delete(id);
  }
}

export default new DepartmentsService();
