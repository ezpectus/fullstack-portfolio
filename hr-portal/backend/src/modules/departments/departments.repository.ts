import { prisma } from '../../config/db';
import { paginateParams, buildSearchFilter } from '../../shared/utils';

export class DepartmentsRepository {
  async findMany(params: { page?: number; limit?: number; search?: string }) {
    const { skip, take, page, limit } = paginateParams(params.page, params.limit);
    const where = buildSearchFilter(['name', 'description'], params.search);
    const [items, total] = await Promise.all([
      prisma.department.findMany({ where, skip, take, include: { manager: true, _count: { select: { employees: true } } }, orderBy: { name: 'asc' } }),
      prisma.department.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async findById(id: string) {
    return prisma.department.findUnique({ where: { id }, include: { manager: true, employees: { include: { user: { select: { name: true, email: true } } } } } });
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
