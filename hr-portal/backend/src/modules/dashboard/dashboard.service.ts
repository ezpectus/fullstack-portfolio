import { prisma } from '../../config/db';

export class DashboardService {
  async getStats() {
    const [totalEmployees, activeEmployees, onLeaveEmployees, totalDepartments, pendingLeaves, totalPayslips, paidPayslips] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: 'ACTIVE' } }),
      prisma.employee.count({ where: { status: 'ON_LEAVE' } }),
      prisma.department.count(),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
      prisma.payslip.count(),
      prisma.payslip.count({ where: { status: 'PAID' } }),
    ]);

    return {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      totalDepartments,
      pendingLeaves,
      totalPayslips,
      paidPayslips,
    };
  }

  async getEmployeeGrowth() {
    const employees = await prisma.employee.findMany({
      select: { hireDate: true },
      orderBy: { hireDate: 'asc' },
    });
    const byMonth: Record<string, number> = {};
    employees.forEach((e) => {
      const key = `${e.hireDate.getFullYear()}-${String(e.hireDate.getMonth() + 1).padStart(2, '0')}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });
    return Object.entries(byMonth).map(([month, count]) => ({ month, count }));
  }

  async getDepartmentDistribution() {
    const departments = await prisma.department.findMany({
      include: { _count: { select: { employees: true } } },
    });
    return departments.map((d) => ({ name: d.name, count: d._count.employees }));
  }

  async getLeaveTrends() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const leaves = await prisma.leaveRequest.findMany({
      where: { startDate: { gte: start, lte: end } },
      select: { startDate: true, status: true },
    });
    const byMonth: Record<string, { approved: number; pending: number; rejected: number }> = {};
    leaves.forEach((l) => {
      const key = String(l.startDate.getMonth() + 1).padStart(2, '0');
      if (!byMonth[key]) byMonth[key] = { approved: 0, pending: 0, rejected: 0 };
      if (l.status === 'APPROVED') byMonth[key].approved++;
      else if (l.status === 'PENDING') byMonth[key].pending++;
      else if (l.status === 'REJECTED') byMonth[key].rejected++;
    });
    return Object.entries(byMonth).map(([month, data]) => ({ month, ...data }));
  }
}

export default new DashboardService();
