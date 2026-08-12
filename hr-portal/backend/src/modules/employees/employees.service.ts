import employeesRepository from './employees.repository';
import { NotFoundError } from '../../shared/errors';

export class EmployeesService {
  async list(params: { page?: number; limit?: number; search?: string; departmentId?: string; status?: string }) {
    return employeesRepository.findMany(params);
  }

  async getById(id: string) {
    const emp = await employeesRepository.findById(id);
    if (!emp) throw new NotFoundError('Employee');
    return emp;
  }

  async getByUserId(userId: string) {
    const emp = await employeesRepository.findByUserId(userId);
    if (!emp) throw new NotFoundError('Employee');
    return emp;
  }

  async create(data: any) {
    return employeesRepository.create(data);
  }

  async update(id: string, data: any) {
    const emp = await employeesRepository.findById(id);
    if (!emp) throw new NotFoundError('Employee');
    return employeesRepository.update(id, data);
  }

  async delete(id: string) {
    const emp = await employeesRepository.findById(id);
    if (!emp) throw new NotFoundError('Employee');
    return employeesRepository.delete(id);
  }

  async getOrgStructure() {
    return employeesRepository.getOrgStructure();
  }
}

export default new EmployeesService();
