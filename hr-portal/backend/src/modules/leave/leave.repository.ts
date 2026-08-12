import { prisma } from '../../config/db';
import { paginateParams } from '../../shared/utils';

const include = {
  employee: { include: { user: { select: { name: true, email: true } }, department: true } },
  leaveType: true,
};

export class LeaveRepository {
  async findMany(params: { page?: number; limit?: number; employeeId?: string; status?: string; departmentId?: string }) {
    const { skip, take, page, limit } = paginateParams(params.page, params.limit);
    const where = {
      ...(params.employeeId ? { employeeId: params.employeeId } : {}),
      ...(params.status ? { status: params.status as any } : {}),
      ...(params.departmentId ? { employee: { departmentId: params.departmentId } } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.leaveRequest.findMany({ where, skip, take, include, orderBy: { createdAt: 'desc' } }),
      prisma.leaveRequest.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async findById(id: string) {
    return prisma.leaveRequest.findUnique({ where: { id }, include });
  }

  async create(data: any) {
    return prisma.leaveRequest.create({ data, include });
  }

  async update(id: string, data: any) {
    return prisma.leaveRequest.update({ where: { id }, data, include });
  }

  async findLeaveTypes() {
    return prisma.leaveType.findMany();
  }

  async getApprovedDaysByEmployee(employeeId: string, year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59);
    const requests = await prisma.leaveRequest.findMany({
      where: { employeeId, status: 'APPROVED', startDate: { gte: start, lte: end } },
      select: { days: true, leaveTypeId: true },
    });
    return requests;
  }
}

export default new LeaveRepository();
