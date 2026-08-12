import { prisma } from '../../config/db';
import { paginate, buildPageMeta } from '../../shared/pagination';

export class MedicalRecordsRepository {
  async findMany(params: { page: number; limit: number; patientId?: string; doctorId?: string }) {
    const where: any = {};
    if (params.patientId) where.patientId = params.patientId;
    if (params.doctorId) where.doctorId = params.doctorId;
    const total = await prisma.medicalRecord.count({ where });
    const items = await prisma.medicalRecord.findMany({
      where,
      ...paginate(params.page, params.limit),
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: { select: { id: true, startTime: true, endTime: true, status: true } },
        patient: { select: { id: true, user: { select: { name: true } } } },
        doctor: { select: { id: true, user: { select: { name: true } }, specialization: true } },
      },
    });
    return { items, meta: buildPageMeta(total, params.page, params.limit) };
  }

  async findById(id: string) {
    return prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        appointment: true,
        patient: { include: { user: { select: { name: true, email: true } } } },
        doctor: { include: { user: { select: { name: true } }, department: true } },
      },
    });
  }

  async findByAppointmentId(appointmentId: string) {
    return prisma.medicalRecord.findUnique({ where: { appointmentId } });
  }

  async create(data: any) {
    return prisma.medicalRecord.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.medicalRecord.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.medicalRecord.delete({ where: { id } });
  }
}

export default new MedicalRecordsRepository();
