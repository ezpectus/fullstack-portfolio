import appointmentsRepository from './appointments.repository';
import { AppError } from '../../middleware/errorHandler';
import { acquireLock, releaseLock } from '../../config/redis';

export class AppointmentsService {
  async list(query: any) {
    return appointmentsRepository.findMany(query);
  }

  async getById(id: string) {
    const appt = await appointmentsRepository.findById(id);
    if (!appt) throw new AppError('Appointment not found', 404);
    return appt;
  }

  async create(data: any) {
    const lockKey = `appointment:${data.doctorId}:${data.startTime.toISOString()}`;
    const locked = await acquireLock(lockKey, 10);
    if (!locked) throw new AppError('Slot is being booked, please try again', 409);

    try {
      const conflict = await appointmentsRepository.findConflicting(data.doctorId, data.startTime, data.endTime);
      if (conflict) throw new AppError('Time slot is already booked', 409);
      return await appointmentsRepository.create(data);
    } finally {
      await releaseLock(lockKey);
    }
  }

  async update(id: string, data: any) {
    const appt = await appointmentsRepository.findById(id);
    if (!appt) throw new AppError('Appointment not found', 404);
    return appointmentsRepository.update(id, data);
  }

  async delete(id: string) {
    const appt = await appointmentsRepository.findById(id);
    if (!appt) throw new AppError('Appointment not found', 404);
    return appointmentsRepository.delete(id);
  }
}

export default new AppointmentsService();
