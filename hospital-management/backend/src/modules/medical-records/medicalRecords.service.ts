import medicalRecordsRepository from './medicalRecords.repository';
import { AppError } from '../../middleware/errorHandler';

export class MedicalRecordsService {
  async list(query: { page: number; limit: number; patientId?: string; doctorId?: string }) {
    return medicalRecordsRepository.findMany(query);
  }

  async getById(id: string) {
    const record = await medicalRecordsRepository.findById(id);
    if (!record) throw new AppError('Medical record not found', 404);
    return record;
  }

  async getByAppointmentId(appointmentId: string) {
    const record = await medicalRecordsRepository.findByAppointmentId(appointmentId);
    if (!record) throw new AppError('Medical record not found', 404);
    return record;
  }

  async create(data: any) {
    const existing = await medicalRecordsRepository.findByAppointmentId(data.appointmentId);
    if (existing) throw new AppError('Medical record already exists for this appointment', 409);
    return medicalRecordsRepository.create(data);
  }

  async update(id: string, data: any) {
    const record = await medicalRecordsRepository.findById(id);
    if (!record) throw new AppError('Medical record not found', 404);
    return medicalRecordsRepository.update(id, data);
  }

  async delete(id: string) {
    const record = await medicalRecordsRepository.findById(id);
    if (!record) throw new AppError('Medical record not found', 404);
    return medicalRecordsRepository.delete(id);
  }
}

export default new MedicalRecordsService();
