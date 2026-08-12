import payrollRepository from './payroll.repository';
import { NotFoundError, BadRequestError } from '../../shared/errors';
import { prisma } from '../../config/db';
import { generatePayslipPDF } from '../../shared/pdf';

export class PayrollService {
  async list(params: any) {
    return payrollRepository.findMany(params);
  }

  async getById(id: string) {
    const slip = await payrollRepository.findById(id);
    if (!slip) throw new NotFoundError('Payslip');
    return slip;
  }

  async create(data: any) {
    if (data.baseSalary < 0 || data.bonus < 0 || data.allowances < 0 || data.deductions < 0) {
      throw new BadRequestError('Salary values cannot be negative');
    }
    const total = data.baseSalary + data.bonus + data.allowances - data.deductions;
    return payrollRepository.create({ ...data, total });
  }

  async update(id: string, data: any) {
    const slip = await payrollRepository.findById(id);
    if (!slip) throw new NotFoundError('Payslip');

    const baseSalary = data.baseSalary ?? slip.baseSalary;
    const bonus = data.bonus ?? slip.bonus;
    const allowances = data.allowances ?? slip.allowances;
    const deductions = data.deductions ?? slip.deductions;

    if (baseSalary < 0 || bonus < 0 || allowances < 0 || deductions < 0) {
      throw new BadRequestError('Salary values cannot be negative');
    }

    const total = baseSalary + bonus + allowances - deductions;

    const updateData: any = { ...data, total };
    if (data.status === 'APPROVED' && slip.status === 'DRAFT') {
      updateData.approvedAt = new Date();
    }
    if (data.status === 'PAID' && slip.status === 'APPROVED') {
      updateData.paidAt = new Date();
    }

    return payrollRepository.update(id, updateData);
  }

  async approve(id: string, approverId: string) {
    const slip = await payrollRepository.findById(id);
    if (!slip) throw new NotFoundError('Payslip');
    if (slip.status !== 'DRAFT') throw new BadRequestError('Only draft payslips can be approved');
    return payrollRepository.update(id, { status: 'APPROVED', approvedById: approverId, approvedAt: new Date() });
  }

  async markPaid(id: string) {
    const slip = await payrollRepository.findById(id);
    if (!slip) throw new NotFoundError('Payslip');
    if (slip.status !== 'APPROVED') throw new BadRequestError('Only approved payslips can be marked as paid');
    return payrollRepository.update(id, { status: 'PAID', paidAt: new Date() });
  }

  async delete(id: string) {
    const slip = await payrollRepository.findById(id);
    if (!slip) throw new NotFoundError('Payslip');
    return payrollRepository.delete(id);
  }

  async getPayslipPDF(id: string): Promise<Buffer> {
    const slip = await payrollRepository.findById(id);
    if (!slip) throw new NotFoundError('Payslip');
    return generatePayslipPDF({
      employeeName: `${slip.employee.firstName} ${slip.employee.lastName}`,
      position: slip.employee.position,
      department: slip.employee.department?.name || 'N/A',
      month: slip.month,
      year: slip.year,
      baseSalary: slip.baseSalary,
      bonus: slip.bonus,
      allowances: slip.allowances,
      deductions: slip.deductions,
      total: slip.total,
    });
  }

  async getSalaryFund() {
    const departments = await prisma.department.findMany({
      include: { employees: { where: { status: 'ACTIVE' }, select: { salary: true } } },
    });
    return departments.map((d) => ({
      department: d.name,
      totalSalary: d.employees.reduce((sum, e) => sum + e.salary, 0),
      employeeCount: d.employees.length,
    }));
  }
}

export default new PayrollService();
