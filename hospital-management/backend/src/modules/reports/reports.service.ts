import { prisma } from '../../config/db';

export class ReportsService {
  async getAppointmentReport(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate && endDate) {
      where.startTime = { gte: startDate, lte: endDate };
    }

    const [total, byStatus, byDepartment] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.groupBy({ by: ['status'], _count: true, where }),
      prisma.appointment.findMany({
        where,
        select: { doctor: { select: { department: { select: { name: true } } } } },
      }),
    ]);

    const deptCount: Record<string, number> = {};
    byDepartment.forEach((a: any) => {
      const deptName = a.doctor?.department?.name || 'Unassigned';
      deptCount[deptName] = (deptCount[deptName] || 0) + 1;
    });

    return {
      total,
      byStatus: byStatus.map((s: any) => ({ status: s.status, count: s._count })),
      byDepartment: Object.entries(deptCount).map(([name, count]) => ({ name, count })),
    };
  }

  async getPatientReport() {
    const [total, byGender, byBloodType] = await Promise.all([
      prisma.patient.count(),
      prisma.patient.groupBy({ by: ['gender'], _count: true }),
      prisma.patient.groupBy({ by: ['bloodType'], _count: true }),
    ]);

    return {
      total,
      byGender: byGender.map((g: any) => ({ gender: g.gender, count: g._count })),
      byBloodType: byBloodType.map((b: any) => ({ bloodType: b.bloodType, count: b._count })),
    };
  }

  async getDoctorReport() {
    const [total, bySpecialization, byDepartment] = await Promise.all([
      prisma.doctor.count({ where: { isActive: true } }),
      prisma.doctor.groupBy({ by: ['specialization'], _count: true }),
      prisma.doctor.findMany({
        where: { isActive: true },
        select: { department: { select: { name: true } } },
      }),
    ]);

    const deptCount: Record<string, number> = {};
    byDepartment.forEach((d: any) => {
      const deptName = d.department?.name || 'Unassigned';
      deptCount[deptName] = (deptCount[deptName] || 0) + 1;
    });

    return {
      total,
      bySpecialization: bySpecialization.map((s: any) => ({ specialization: s.specialization, count: s._count })),
      byDepartment: Object.entries(deptCount).map(([name, count]) => ({ name, count })),
    };
  }

  async getRevenueReport(startDate?: Date, endDate?: Date) {
    const where: any = { status: 'COMPLETED' };
    if (startDate && endDate) {
      where.startTime = { gte: startDate, lte: endDate };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      select: { doctor: { select: { consultationFee: true, specialization: true } } },
    });

    const totalRevenue = appointments.reduce((sum: number, a: any) => sum + (a.doctor?.consultationFee || 0), 0);
    const bySpecialization: Record<string, number> = {};
    appointments.forEach((a: any) => {
      const spec = a.doctor?.specialization || 'Unknown';
      bySpecialization[spec] = (bySpecialization[spec] || 0) + (a.doctor?.consultationFee || 0);
    });

    return {
      totalRevenue,
      totalAppointments: appointments.length,
      bySpecialization: Object.entries(bySpecialization).map(([specialization, revenue]) => ({ specialization, revenue })),
    };
  }
}

export default new ReportsService();
