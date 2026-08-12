import { prisma } from '../../config/db';
import { BadRequestError } from '../../shared/errors';

export class ReportsService {
  async getHeadcountReport() {
    const departments = await prisma.department.findMany({
      include: {
        _count: { select: { employees: true } },
        employees: { where: { status: 'ACTIVE' }, select: { id: true } },
      },
    });
    return departments.map((d) => ({
      department: d.name,
      totalEmployees: d._count.employees,
      activeEmployees: d.employees.length,
    }));
  }

  async getPayrollReport(month?: number, year?: number) {
    const where: any = {};
    if (month) where.month = month;
    if (year) where.year = year;

    const payslips = await prisma.payslip.findMany({
      where,
      include: { employee: { include: { user: { select: { name: true } }, department: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    const totalPayroll = payslips.reduce((sum, p) => sum + p.total, 0);
    const totalBonus = payslips.reduce((sum, p) => sum + p.bonus, 0);
    const totalDeductions = payslips.reduce((sum, p) => sum + p.deductions, 0);

    return {
      summary: { totalPayroll, totalBonus, totalDeductions, count: payslips.length },
      details: payslips,
    };
  }

  async getLeaveReport(year?: number) {
    const y = year || new Date().getFullYear();
    const start = new Date(y, 0, 1);
    const end = new Date(y, 11, 31, 23, 59, 59);

    const requests = await prisma.leaveRequest.findMany({
      where: { startDate: { gte: start, lte: end } },
      include: {
        employee: { include: { user: { select: { name: true } }, department: true } },
        leaveType: true,
      },
    });

    const byStatus = {
      pending: requests.filter((r) => r.status === 'PENDING').length,
      approved: requests.filter((r) => r.status === 'APPROVED').length,
      rejected: requests.filter((r) => r.status === 'REJECTED').length,
      cancelled: requests.filter((r) => r.status === 'CANCELLED').length,
    };

    const byType: Record<string, number> = {};
    requests.forEach((r) => {
      const name = r.leaveType.name;
      byType[name] = (byType[name] || 0) + r.days;
    });

    return { totalRequests: requests.length, byStatus, byType, details: requests };
  }

  async getEmployeeReport(employeeId: string) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: { select: { name: true, email: true, role: true } },
        department: true,
        manager: { include: { user: { select: { name: true } } } },
        leaveRequests: { include: { leaveType: true }, orderBy: { createdAt: 'desc' } },
        payslips: { orderBy: [{ year: 'desc' }, { month: 'desc' }] },
        documents: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!employee) return null;

    const totalLeaveDays = employee.leaveRequests
      .filter((r) => r.status === 'APPROVED')
      .reduce((sum, r) => sum + r.days, 0);

    return {
      employee,
      summary: {
        totalLeaveDays,
        totalPayslips: employee.payslips.length,
        totalDocuments: employee.documents.length,
      },
    };
  }

  async exportCSV(reportType: string): Promise<string> {
    let headers: string[];
    let rows: any[];

    switch (reportType) {
      case 'headcount': {
        const result = await this.getHeadcountReport();
        headers = ['Department', 'Total Employees', 'Active Employees'];
        rows = result.map((r) => [r.department, r.totalEmployees, r.activeEmployees]);
        break;
      }
      case 'payroll': {
        const result = await this.getPayrollReport();
        headers = ['Employee', 'Department', 'Month', 'Year', 'Base', 'Bonus', 'Allowances', 'Deductions', 'Total', 'Status'];
        rows = result.details.map((p: any) => [
          p.employee.user.name,
          p.employee.department?.name || 'N/A',
          p.month,
          p.year,
          p.baseSalary,
          p.bonus,
          p.allowances,
          p.deductions,
          p.total,
          p.status,
        ]);
        break;
      }
      case 'leave': {
        const result = await this.getLeaveReport();
        headers = ['Employee', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status'];
        rows = result.details.map((r: any) => [
          r.employee.user.name,
          r.employee.department?.name || 'N/A',
          r.leaveType.name,
          r.startDate.toISOString().split('T')[0],
          r.endDate.toISOString().split('T')[0],
          r.days,
          r.status,
        ]);
        break;
      }
      default:
        throw new BadRequestError('Invalid report type');
    }

    const csv = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }
}

export default new ReportsService();
