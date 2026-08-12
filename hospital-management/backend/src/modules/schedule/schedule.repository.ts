import { prisma } from '../../config/db';

export class ScheduleRepository {
  async getWorkingHours(doctorId: string) {
    return prisma.workingHours.findMany({ where: { doctorId }, orderBy: { dayOfWeek: 'asc' } });
  }

  async addWorkingHours(doctorId: string, data: any) {
    return prisma.workingHours.create({ data: { ...data, doctorId } });
  }

  async updateWorkingHours(id: string, data: any) {
    return prisma.workingHours.update({ where: { id }, data });
  }

  async deleteWorkingHours(id: string) {
    return prisma.workingHours.delete({ where: { id } });
  }

  async getTimeOff(doctorId: string) {
    return prisma.timeOff.findMany({ where: { doctorId }, orderBy: { startDate: 'desc' } });
  }

  async addTimeOff(doctorId: string, data: any) {
    return prisma.timeOff.create({ data: { ...data, doctorId } });
  }

  async deleteTimeOff(id: string) {
    return prisma.timeOff.delete({ where: { id } });
  }

  async getServices(doctorId: string) {
    return prisma.doctorService.findMany({ where: { doctorId }, orderBy: { name: 'asc' } });
  }

  async addService(doctorId: string, data: any) {
    return prisma.doctorService.create({ data: { ...data, doctorId } });
  }

  async updateService(id: string, data: any) {
    return prisma.doctorService.update({ where: { id }, data });
  }

  async deleteService(id: string) {
    return prisma.doctorService.delete({ where: { id } });
  }
}

export default new ScheduleRepository();
