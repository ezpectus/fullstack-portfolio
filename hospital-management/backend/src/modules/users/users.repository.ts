import { prisma } from '../../config/db';
import { paginate, buildPageMeta } from '../../shared/pagination';

export class UsersRepository {
  async findMany(params: { page: number; limit: number; role?: string; search?: string }) {
    const where: any = {};
    if (params.role) where.role = params.role;
    if (params.search) where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ];
    const total = await prisma.user.count({ where });
    const items = await prisma.user.findMany({
      where,
      ...paginate(params.page, params.limit),
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, isActive: true, createdAt: true },
    });
    return { items, meta: buildPageMeta(total, params.page, params.limit) };
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, isActive: true, createdAt: true },
    });
  }

  async update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data, select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, isActive: true } });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UsersRepository();
