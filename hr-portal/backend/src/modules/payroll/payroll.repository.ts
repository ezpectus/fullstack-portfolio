import { prisma } from '../../config/db';
import { paginateParams } from '../../shared/utils';

const include = {
  employee: { include: { user: { select: { name: true, email: true } }, department: true } },
};

export class PayrollRepository {
  async findMany(params: { page?: number; limit?: number; employeeId?: string; status?: string; type?: string; month?: number; year?: number }) {
    const { skip, take, page, limit } = paginateParams(params.page, params.limit);
    const where = {
      ...(params.employeeId ? { employeeId: params.employeeId } : {}),
      ...(params.status ? { status: params.status as any } : {}),
      ...(params.type ? { type: params.type as any } : {}),
      ...(params.month ? { month: params.month } : {}),
      ...(params.year ? { year: params.year } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.payslip.findMany({ where, skip, take, include, orderBy: [{ year: 'desc' }, { month: 'desc' }] }),
      prisma.payslip.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async findById(id: string) {
    return prisma.payslip.findUnique({ where: { id }, include });
  }

  async create(data: any) {
    return prisma.payslip.create({ data, include });
  }

  async update(id: string, data: any) {
    return prisma.payslip.update({ where: { id }, data, include });
  }

  async delete(id: string) {
    return prisma.payslip.delete({ where: { id } });
  }
}

export default new PayrollRepository();
