import { prisma } from '../../config/db';
import { generateTimeSlots } from '../../shared/utils';

export class ScheduleRepository {
  async getProviderSchedule(providerId: string, startDate: Date, endDate: Date) {
    const [workingHours, timeOffs, bookings] = await Promise.all([
      prisma.workingHours.findMany({ where: { providerId } }),
      prisma.timeOff.findMany({ where: { providerId, startDate: { lte: endDate }, endDate: { gte: startDate } } }),
      prisma.booking.findMany({
        where: { providerId, startTime: { gte: startDate }, endTime: { lte: endDate }, status: { notIn: ['CANCELLED'] } },
      }),
    ]);
    return { workingHours, timeOffs, bookings };
  }

  async getAvailableSlots(providerId: string, date: Date, serviceDuration: number, bufferMinutes = 0) {
    const dayOfWeek = date.getDay();
    const workingHours = await prisma.workingHours.findMany({ where: { providerId, dayOfWeek, isBreak: false } });
    const breakHours = await prisma.workingHours.findMany({ where: { providerId, dayOfWeek, isBreak: true } });

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const timeOffs = await prisma.timeOff.findMany({ where: { providerId, startDate: { lte: dayEnd }, endDate: { gte: dayStart } } });
    if (timeOffs.length > 0) return [];

    const bookings = await prisma.booking.findMany({
      where: { providerId, startTime: { gte: dayStart }, endTime: { lte: dayEnd }, status: { notIn: ['CANCELLED'] } },
    });

    const allSlots: { start: string; end: string; available: boolean }[] = [];

    for (const wh of workingHours) {
      const slots = generateTimeSlots(wh.startTime, wh.endTime, serviceDuration, bufferMinutes);
      for (const slot of slots) {
        const slotStart = new Date(date);
        const [sh, sm] = slot.start.split(':').map(Number);
        slotStart.setHours(sh, sm, 0, 0);
        const slotEnd = new Date(date);
        const [eh, em] = slot.end.split(':').map(Number);
        slotEnd.setHours(eh, em, 0, 0);

        const isBooked = bookings.some((b) => {
          return (slotStart >= b.startTime && slotStart < b.endTime) || (slotEnd > b.startTime && slotEnd <= b.endTime) || (slotStart <= b.startTime && slotEnd >= b.endTime);
        });

        const isOnBreak = breakHours.some((bh) => {
          const [bsh, bsm] = bh.startTime.split(':').map(Number);
          const [beh, bem] = bh.endTime.split(':').map(Number);
          const breakStart = bsh * 60 + bsm;
          const breakEnd = beh * 60 + bem;
          const slotStartMin = sh * 60 + sm;
          const slotEndMin = eh * 60 + em;
          return slotStartMin < breakEnd && slotEndMin > breakStart;
        });

        const isPast = slotStart < new Date();

        allSlots.push({ start: slot.start, end: slot.end, available: !isBooked && !isOnBreak && !isPast });
      }
    }

    return allSlots;
  }

  async blockSlots(providerId: string, startDate: Date, endDate: Date, reason?: string) {
    return prisma.timeOff.create({ data: { providerId, startDate, endDate, reason } });
  }

  async unblockSlots(id: string) {
    return prisma.timeOff.delete({ where: { id } });
  }
}

export const scheduleRepository = new ScheduleRepository();
