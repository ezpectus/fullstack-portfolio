import doctorsRepository from './doctors.repository';
import { AppError } from '../../middleware/errorHandler';

export class DoctorsService {
  async list(query: { page: number; limit: number; departmentId?: string; search?: string }) {
    return doctorsRepository.findMany(query);
  }

  async getById(id: string) {
    const doctor = await doctorsRepository.findById(id);
    if (!doctor) throw new AppError('Doctor not found', 404);
    return doctor;
  }

  async create(data: any) {
    return doctorsRepository.create(data);
  }

  async update(id: string, data: any) {
    const doctor = await doctorsRepository.findById(id);
    if (!doctor) throw new AppError('Doctor not found', 404);
    return doctorsRepository.update(id, data);
  }

  async delete(id: string) {
    const doctor = await doctorsRepository.findById(id);
    if (!doctor) throw new AppError('Doctor not found', 404);
    return doctorsRepository.delete(id);
  }
}

export default new DoctorsService();
