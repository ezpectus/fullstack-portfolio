import { prisma } from '../../config/db';
import { paginate, buildPageMeta } from '../../shared/pagination';

export class AppointmentsRepository {
  async findMany(params: { page: number; limit: number; doctorId?: string; patientId?: string; status?: string; date?: string }) {
    const where: any = {};
    if (params.doctorId) where.doctorId = params.doctorId;
    if (params.patientId) where.patientId = params.patientId;
    if (params.status) where.status = params.status;
    if (params.date) {
      const dayStart = new Date(params.date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      where.startTime = { gte: dayStart, lt: dayEnd };
    }
    const total = await prisma.appointment.count({ where });
    const items = await prisma.appointment.findMany({
      where,
      ...paginate(params.page, params.limit),
      include: {
        doctor: { include: { user: { select: { name: true } }, department: { select: { name: true } } } },
        patient: { include: { user: { select: { name: true, phone: true } } } },
        medicalRecord: { select: { id: true } },
      },
      orderBy: { startTime: 'asc' },
    });
    return { items, meta: buildPageMeta(total, params.page, params.limit) };
  }

  async findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: { include: { user: { select: { name: true, email: true, phone: true } }, department: true } },
        patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
        medicalRecord: true,
        notifications: true,
      },
    });
  }

  async create(data: any) {
    return prisma.appointment.create({ data, include: { doctor: { include: { user: { select: { name: true } } } }, patient: { include: { user: { select: { name: true } } } } } });
  }

  async update(id: string, data: any) {
    return prisma.appointment.update({ where: { id }, data, include: { doctor: { include: { user: { select: { name: true } } } }, patient: { include: { user: { select: { name: true } } } } } });
  }

  async delete(id: string) {
    return prisma.appointment.delete({ where: { id } });
  }

  async findConflicting(doctorId: string, startTime: Date, endTime: Date, excludeId?: string) {
    return prisma.appointment.findFirst({
      where: {
        doctorId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
  }
}

export default new AppointmentsRepository();
