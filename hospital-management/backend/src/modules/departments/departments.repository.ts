import { prisma } from '../../config/db';
import { paginate, buildPageMeta } from '../../shared/pagination';

export class DepartmentsRepository {
  async findMany(params: { page: number; limit: number; search?: string }) {
    const where: any = {};
    if (params.search) where.name = { contains: params.search, mode: 'insensitive' };
    const total = await prisma.department.count({ where });
    const items = await prisma.department.findMany({
      where,
      ...paginate(params.page, params.limit),
      include: { headDoctor: { include: { user: { select: { name: true } } } }, _count: { select: { doctors: true } } },
      orderBy: { name: 'asc' },
    });
    return { items, meta: buildPageMeta(total, params.page, params.limit) };
  }

  async findById(id: string) {
    return prisma.department.findUnique({
      where: { id },
      include: { headDoctor: { include: { user: { select: { name: true, email: true } } } }, doctors: { include: { user: { select: { name: true, email: true } } } } },
    });
  }

  async create(data: any) {
    return prisma.department.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.department.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.department.delete({ where: { id } });
  }
}

export default new DepartmentsRepository();
