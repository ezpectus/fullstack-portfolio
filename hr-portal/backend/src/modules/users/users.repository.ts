import { prisma } from '../../config/db';
import { paginateParams, buildSearchFilter } from '../../shared/utils';

export class UsersRepository {
  async findMany(params: { page?: number; limit?: number; search?: string; role?: string }) {
    const { skip, take, page, limit } = paginateParams(params.page, params.limit);
    const where = {
      ...buildSearchFilter(['name', 'email'], params.search),
      ...(params.role ? { role: params.role as any } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, select: { id: true, email: true, name: true, role: true, phone: true, isActive: true, createdAt: true } }),
      prisma.user.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, isActive: true, createdAt: true } });
  }

  async update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data, select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, isActive: true, createdAt: true } });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UsersRepository();
