import { prisma } from '../../config/db';
import { paginateParams, buildSearchFilter } from '../../shared/utils';

const include = {
  user: { select: { id: true, name: true, email: true, role: true, phone: true, avatar: true } },
  department: true,
  manager: { include: { user: { select: { name: true } } } },
  subordinates: { include: { user: { select: { name: true } } } },
};

export class EmployeesRepository {
  async findMany(params: { page?: number; limit?: number; search?: string; departmentId?: string; status?: string }) {
    const { skip, take, page, limit } = paginateParams(params.page, params.limit);
    const where = {
      ...buildSearchFilter(['firstName', 'lastName', 'position'], params.search),
      ...(params.departmentId ? { departmentId: params.departmentId } : {}),
      ...(params.status ? { status: params.status as any } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.employee.findMany({ where, skip, take, include, orderBy: { createdAt: 'desc' } }),
      prisma.employee.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async findById(id: string) {
    return prisma.employee.findUnique({ where: { id }, include });
  }

  async findByUserId(userId: string) {
    return prisma.employee.findUnique({ where: { userId }, include });
  }

  async create(data: any) {
    return prisma.employee.create({ data, include });
  }

  async update(id: string, data: any) {
    return prisma.employee.update({ where: { id }, data, include });
  }

  async delete(id: string) {
    return prisma.employee.delete({ where: { id } });
  }

  async getOrgStructure() {
    return prisma.employee.findMany({
      where: { managerId: null },
      include: {
        user: { select: { name: true, email: true } },
        department: true,
        subordinates: {
          include: {
            user: { select: { name: true, email: true } },
            department: true,
            subordinates: { include: { user: { select: { name: true } }, department: true } },
          },
        },
      },
    });
  }
}

export default new EmployeesRepository();
