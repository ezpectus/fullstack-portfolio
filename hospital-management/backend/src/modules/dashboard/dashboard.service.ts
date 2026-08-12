import { prisma } from '../../config/db';

export class DashboardService {
  async getOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const [appointmentsToday, appointmentsThisWeek, totalPatients, newPatientsThisMonth, totalDoctors, departments] = await Promise.all([
      prisma.appointment.count({ where: { startTime: { gte: today, lt: tomorrow } } }),
      prisma.appointment.count({ where: { startTime: { gte: today, lt: weekEnd } } }),
      prisma.patient.count(),
      prisma.patient.count({
        where: { createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) } },
      }),
      prisma.doctor.count({ where: { isActive: true } }),
      prisma.department.count(),
    ]);

    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: true,
    });

    const noShowRate = appointmentsByStatus.find((s: any) => s.status === 'NO_SHOW')?._count || 0;
    const totalAppointments = appointmentsByStatus.reduce((sum: number, s: any) => sum + s._count, 0);

    const topSpecializations = await prisma.doctor.groupBy({
      by: ['specialization'],
      _count: true,
      orderBy: { _count: { specialization: 'desc' } },
      take: 5,
    });

    const doctorLoad = await prisma.appointment.groupBy({
      by: ['doctorId'],
      _count: true,
      where: { startTime: { gte: today, lt: weekEnd } },
      orderBy: { _count: { doctorId: 'desc' } },
      take: 10,
    });

    const topDoctors = await Promise.all(
      doctorLoad.map(async (d: any) => {
        const doctor = await prisma.doctor.findUnique({
          where: { id: d.doctorId },
          include: { user: { select: { name: true } } },
        });
        return { doctorId: d.doctorId, name: doctor?.user.name, appointments: d._count, specialization: doctor?.specialization };
      }),
    );

    return {
      appointmentsToday,
      appointmentsThisWeek,
      totalPatients,
      newPatientsThisMonth,
      totalDoctors,
      departments,
      appointmentsByStatus: appointmentsByStatus.map((s: any) => ({ status: s.status, count: s._count })),
      noShowRate: totalAppointments > 0 ? (noShowRate / totalAppointments) * 100 : 0,
      topSpecializations: topSpecializations.map((s: any) => ({ specialization: s.specialization, count: s._count })),
      topDoctors,
    };
  }
}

export default new DashboardService();
