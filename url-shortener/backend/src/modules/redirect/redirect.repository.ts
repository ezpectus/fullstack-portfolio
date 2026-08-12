import { prisma } from '../../config/db';

export const redirectRepository = {
  findByCode: (shortCode: string) => prisma.shortLink.findUnique({ where: { shortCode } }),

  createClick: (data: { shortLinkId: string; ip: string | null; userAgent: string | null; referer: string | null; device: string; browser: string }) =>
    prisma.click.create({ data }),
};
