import patientsRepository from './patients.repository';
import { AppError } from '../../middleware/errorHandler';

export class PatientsService {
  async list(query: { page: number; limit: number; search?: string }) {
    return patientsRepository.findMany(query);
  }

  async getById(id: string) {
    const patient = await patientsRepository.findById(id);
    if (!patient) throw new AppError('Patient not found', 404);
    return patient;
  }

  async create(data: any) {
    return patientsRepository.create(data);
  }

  async update(id: string, data: any) {
    const patient = await patientsRepository.findById(id);
    if (!patient) throw new AppError('Patient not found', 404);
    return patientsRepository.update(id, data);
  }

  async delete(id: string) {
    const patient = await patientsRepository.findById(id);
    if (!patient) throw new AppError('Patient not found', 404);
    return patientsRepository.delete(id);
  }
}

export default new PatientsService();
