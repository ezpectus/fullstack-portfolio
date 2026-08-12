import { prisma } from '../../config/db';

export const linksRepository = {
  findByCode: (shortCode: string) => prisma.shortLink.findUnique({ where: { shortCode } }),

  findByAlias: (alias: string) => prisma.shortLink.findUnique({ where: { alias } }),

  findById: (id: string) => prisma.shortLink.findUnique({ where: { id } }),

  getSettings: (userId: string) => prisma.settings.findUnique({ where: { userId } }),

  list: (userId: string, params: { page: number; limit: number; search?: string; status?: string; sort: string; order: string }) => {
    const where: Record<string, unknown> = { userId };
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { originalUrl: { contains: params.search, mode: 'insensitive' } },
        { shortCode: { contains: params.search, mode: 'insensitive' } },
        { alias: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return prisma.shortLink.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { [params.sort]: params.order },
      include: { _count: { select: { clicks: true } } },
    });
  },

  count: (userId: string, params: { search?: string; status?: string }) => {
    const where: Record<string, unknown> = { userId };
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { originalUrl: { contains: params.search, mode: 'insensitive' } },
        { shortCode: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return prisma.shortLink.count({ where });
  },

  create: (data: { originalUrl: string; shortCode: string; alias?: string; userId: string; expiresAt?: Date | null; password?: string | null }) =>
    prisma.shortLink.create({ data: { ...data, expiresAt: data.expiresAt || null, password: data.password || null } }),

  update: (id: string, data: Record<string, unknown>) => prisma.shortLink.update({ where: { id }, data }),

  delete: (id: string) => prisma.shortLink.delete({ where: { id } }),

  findByUserId: (userId: string) => prisma.shortLink.findMany({ where: { userId }, include: { _count: { select: { clicks: true } } } }),
};
