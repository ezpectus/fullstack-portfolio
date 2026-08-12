import { prisma } from '../../config/db';
import { paginate, buildPageMeta } from '../../shared/pagination';

export class PatientsRepository {
  async findMany(params: { page: number; limit: number; search?: string }) {
    const where: any = {};
    if (params.search) where.OR = [
      { user: { name: { contains: params.search, mode: 'insensitive' } } },
      { user: { email: { contains: params.search, mode: 'insensitive' } } },
      { insuranceNumber: { contains: params.search, mode: 'insensitive' } },
    ];
    const total = await prisma.patient.count({ where });
    const items = await prisma.patient.findMany({
      where,
      ...paginate(params.page, params.limit),
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        primaryDoctor: { include: { user: { select: { name: true } } } },
        _count: { select: { appointments: true, medicalRecords: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { items, meta: buildPageMeta(total, params.page, params.limit) };
  }

  async findById(id: string) {
    return prisma.patient.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        primaryDoctor: { include: { user: { select: { name: true } } } },
        appointments: { include: { doctor: { include: { user: { select: { name: true } } } } }, orderBy: { startTime: 'desc' }, take: 10 },
        medicalRecords: { include: { doctor: { include: { user: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
  }

  async create(data: any) {
    return prisma.patient.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.patient.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.patient.delete({ where: { id } });
  }
}

export default new PatientsRepository();
