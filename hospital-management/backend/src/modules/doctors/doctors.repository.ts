import { prisma } from '../../config/db';
import { paginate, buildPageMeta } from '../../shared/pagination';

export class DoctorsRepository {
  async findMany(params: { page: number; limit: number; departmentId?: string; search?: string }) {
    const where: any = {};
    if (params.departmentId) where.departmentId = params.departmentId;
    if (params.search) where.OR = [
      { specialization: { contains: params.search, mode: 'insensitive' } },
      { user: { name: { contains: params.search, mode: 'insensitive' } } },
    ];
    const total = await prisma.doctor.count({ where });
    const items = await prisma.doctor.findMany({
      where,
      ...paginate(params.page, params.limit),
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        department: { select: { id: true, name: true } },
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { items, meta: buildPageMeta(total, params.page, params.limit) };
  }

  async findById(id: string) {
    return prisma.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        department: true,
        workingHours: true,
        services: true,
        _count: { select: { appointments: true } },
      },
    });
  }

  async create(data: any) {
    return prisma.doctor.create({ data, include: { user: { select: { name: true, email: true } } } });
  }

  async update(id: string, data: any) {
    return prisma.doctor.update({ where: { id }, data, include: { user: { select: { name: true, email: true } } } });
  }

  async delete(id: string) {
    return prisma.doctor.delete({ where: { id } });
  }
}

export default new DoctorsRepository();
