import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export class ProvidersRepository {
  async findMany(params: { skip: number; limit: number; search?: string; isActive?: boolean; serviceId?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
    const where: Prisma.ProviderWhereInput = {};
    if (params.isActive !== undefined) where.isActive = params.isActive;
    if (params.serviceId) where.services = { some: { serviceId: params.serviceId } };
    if (params.search) where.user = { name: { contains: params.search, mode: 'insensitive' } };
    const orderBy: Prisma.ProviderOrderByWithRelationInput = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' };
    const [providers, total] = await Promise.all([
      prisma.provider.findMany({ where, skip: params.skip, take: params.limit, orderBy, include: { user: { select: { id: true, name: true, email: true } }, services: { include: { service: true } }, workingHours: true } }),
      prisma.provider.count({ where }),
    ]);
    return { providers, total };
  }

  async findById(id: string) {
    return prisma.provider.findUnique({ where: { id }, include: { user: { select: { id: true, name: true, email: true } }, services: { include: { service: true } }, workingHours: true, timeOffs: true } });
  }

  async create(data: { userId: string; bio?: string; isActive?: boolean }) {
    return prisma.provider.create({ data, include: { user: { select: { id: true, name: true, email: true } } } });
  }

  async update(id: string, data: { bio?: string; isActive?: boolean }) {
    return prisma.provider.update({ where: { id }, data, include: { user: { select: { id: true, name: true, email: true } } } });
  }

  async delete(id: string) {
    return prisma.provider.delete({ where: { id } });
  }

  async setServices(providerId: string, serviceIds: string[]) {
    await prisma.serviceProvider.deleteMany({ where: { providerId } });
    if (serviceIds.length > 0) {
      await prisma.serviceProvider.createMany({ data: serviceIds.map((serviceId) => ({ providerId, serviceId })) });
    }
  }

  async setWorkingHours(providerId: string, hours: { dayOfWeek: number; startTime: string; endTime: string; isBreak?: boolean }[]) {
    await prisma.workingHours.deleteMany({ where: { providerId } });
    if (hours.length > 0) {
      await prisma.workingHours.createMany({ data: hours.map((h) => ({ providerId, ...h })) });
    }
  }
}

export const providersRepository = new ProvidersRepository();
