import scheduleRepository from './schedule.repository';
import { AppError } from '../../middleware/errorHandler';

export class ScheduleService {
  async getWorkingHours(doctorId: string) {
    return scheduleRepository.getWorkingHours(doctorId);
  }

  async addWorkingHours(doctorId: string, data: any) {
    return scheduleRepository.addWorkingHours(doctorId, data);
  }

  async updateWorkingHours(id: string, data: any) {
    return scheduleRepository.updateWorkingHours(id, data);
  }

  async deleteWorkingHours(id: string) {
    return scheduleRepository.deleteWorkingHours(id);
  }

  async getTimeOff(doctorId: string) {
    return scheduleRepository.getTimeOff(doctorId);
  }

  async addTimeOff(doctorId: string, data: any) {
    return scheduleRepository.addTimeOff(doctorId, data);
  }

  async deleteTimeOff(id: string) {
    return scheduleRepository.deleteTimeOff(id);
  }

  async getServices(doctorId: string) {
    return scheduleRepository.getServices(doctorId);
  }

  async addService(doctorId: string, data: any) {
    return scheduleRepository.addService(doctorId, data);
  }

  async updateService(id: string, data: any) {
    return scheduleRepository.updateService(id, data);
  }

  async deleteService(id: string) {
    return scheduleRepository.deleteService(id);
  }
}

export default new ScheduleService();
