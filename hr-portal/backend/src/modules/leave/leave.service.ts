import leaveRepository from './leave.repository';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../shared/errors';
import { calculateLeaveDays } from '../../shared/utils';
import { sendEmail } from '../../shared/email';
import { prisma } from '../../config/db';

export class LeaveService {
  async list(params: { page?: number; limit?: number; employeeId?: string; status?: string; departmentId?: string }) {
    return leaveRepository.findMany(params);
  }

  async getById(id: string) {
    const req = await leaveRepository.findById(id);
    if (!req) throw new NotFoundError('Leave request');
    return req;
  }

  async create(data: { employeeId: string; leaveTypeId: string; startDate: Date; endDate: Date; comment?: string }) {
    if (data.endDate < data.startDate) throw new BadRequestError('End date must be after start date');

    const employee = await prisma.employee.findUnique({ where: { id: data.employeeId } });
    if (!employee) throw new NotFoundError('Employee');

    const leaveType = await prisma.leaveType.findUnique({ where: { id: data.leaveTypeId } });
    if (!leaveType) throw new NotFoundError('Leave type');

    const overlapping = await prisma.leaveRequest.findFirst({
      where: {
        employeeId: data.employeeId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          { startDate: { lte: data.endDate }, endDate: { gte: data.startDate } },
        ],
      },
    });
    if (overlapping) throw new BadRequestError('Leave request overlaps with an existing approved or pending request');

    const days = calculateLeaveDays(data.startDate, data.endDate);
    return leaveRepository.create({ ...data, days });
  }

  async approve(id: string, approved: boolean, approverId: string, rejectionReason?: string) {
    const req = await leaveRepository.findById(id);
    if (!req) throw new NotFoundError('Leave request');
    if (req.status !== 'PENDING') throw new BadRequestError('Leave request already processed');

    const data = approved
      ? { status: 'APPROVED', approvedById: approverId, approvedAt: new Date() }
      : { status: 'REJECTED', approvedById: approverId, approvedAt: new Date(), rejectionReason };

    const updated = await leaveRepository.update(id, data);

    try {
      const email = req.employee.user.email;
      const subject = approved ? 'Leave Request Approved' : 'Leave Request Rejected';
      const html = approved
        ? `<p>Your leave request from ${req.startDate} to ${req.endDate} has been approved.</p>`
        : `<p>Your leave request from ${req.startDate} to ${req.endDate} has been rejected. Reason: ${rejectionReason || 'N/A'}</p>`;
      await sendEmail(email, subject, html);
    } catch { /* email failure non-critical */ }

    return updated;
  }

  async cancel(id: string, userId: string) {
    const req = await leaveRepository.findById(id);
    if (!req) throw new NotFoundError('Leave request');
    if (req.status !== 'PENDING') throw new BadRequestError('Can only cancel pending requests');
    if (req.employee.userId !== userId) throw new ForbiddenError('Not allowed to cancel this leave request');
    return leaveRepository.update(id, { status: 'CANCELLED' });
  }

  async getLeaveTypes() {
    return leaveRepository.findLeaveTypes();
  }

  async getBalance(employeeId: string, year: number = new Date().getFullYear()) {
    const types = await leaveRepository.findLeaveTypes();
    const used = await leaveRepository.getApprovedDaysByEmployee(employeeId, year);
    const usedByType: Record<string, number> = {};
    used.forEach((u: any) => {
      usedByType[u.leaveTypeId] = (usedByType[u.leaveTypeId] || 0) + u.days;
    });
    return types.map((t: any) => ({
      leaveType: t.name,
      defaultDays: t.defaultDays,
      usedDays: usedByType[t.id] || 0,
      remainingDays: t.defaultDays - (usedByType[t.id] || 0),
    }));
  }
}

export default new LeaveService();
