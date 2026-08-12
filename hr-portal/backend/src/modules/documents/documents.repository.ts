import { prisma } from '../../config/db';
import { paginateParams } from '../../shared/utils';

const include = {
  employee: { include: { user: { select: { name: true, email: true } }, department: true } },
};

export class DocumentsRepository {
  async findMany(params: { page?: number; limit?: number; employeeId?: string; type?: string }) {
    const { skip, take, page, limit } = paginateParams(params.page, params.limit);
    const where = {
      ...(params.employeeId ? { employeeId: params.employeeId } : {}),
      ...(params.type ? { type: params.type as any } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.document.findMany({ where, skip, take, include, orderBy: { createdAt: 'desc' } }),
      prisma.document.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async findById(id: string) {
    return prisma.document.findUnique({ where: { id }, include });
  }

  async create(data: any) {
    return prisma.document.create({ data, include });
  }

  async delete(id: string) {
    return prisma.document.delete({ where: { id } });
  }
}

export default new DocumentsRepository();
