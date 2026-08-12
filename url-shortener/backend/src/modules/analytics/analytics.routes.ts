import { Router, Response } from 'express';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateParams } from '../../middleware/validate';
import { prisma } from '../../config/db';
import { NotFoundError } from '../../shared/errors';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

router.use(authenticate);

router.get('/:id', validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const link = await prisma.shortLink.findUnique({ where: { id: req.params.id } });
  if (!link || link.userId !== req.user!.id) throw new NotFoundError('Link');

  const totalClicks = await prisma.click.count({ where: { shortLinkId: link.id } });
  const uniqueClicks = await prisma.click.count({ where: { shortLinkId: link.id, isUnique: true } });

  const clicksByDay = await prisma.click.findMany({
    where: { shortLinkId: link.id },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const clicksByDayMap = clicksByDay.reduce((acc: Record<string, number>, click) => {
    const day = click.createdAt.toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const topCountries = await prisma.click.groupBy({
    by: ['country'],
    _count: true,
    where: { shortLinkId: link.id, country: { not: null } },
    orderBy: { _count: { country: 'desc' } },
    take: 10,
  });

  const topDevices = await prisma.click.groupBy({
    by: ['device'],
    _count: true,
    where: { shortLinkId: link.id },
    orderBy: { _count: { device: 'desc' } },
  });

  const topBrowsers = await prisma.click.groupBy({
    by: ['browser'],
    _count: true,
    where: { shortLinkId: link.id },
    orderBy: { _count: { browser: 'desc' } },
  });

  const topReferers = await prisma.click.groupBy({
    by: ['referer'],
    _count: true,
    where: { shortLinkId: link.id, referer: { not: null } },
    orderBy: { _count: { referer: 'desc' } },
    take: 10,
  });

  res.json({
    totalClicks,
    uniqueClicks,
    clicksByDay: Object.entries(clicksByDayMap).map(([date, count]) => ({ date, count })),
    topCountries: topCountries.map((c) => ({ country: c.country, count: c._count })),
    topDevices: topDevices.map((c) => ({ device: c.device, count: c._count })),
    topBrowsers: topBrowsers.map((c) => ({ browser: c.browser, count: c._count })),
    topReferers: topReferers.map((c) => ({ referer: c.referer, count: c._count })),
  });
}));

router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const links = await prisma.shortLink.findMany({ where: { userId }, include: { _count: { select: { clicks: true } } } });

  const totalClicks = links.reduce((sum, l) => sum + l._count.clicks, 0);
  const totalLinks = links.length;
  const activeLinks = links.filter((l) => l.status === 'active').length;

  const last30Days = await prisma.click.findMany({
    where: {
      shortLink: { userId },
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const clicksByDay = last30Days.reduce((acc: Record<string, number>, click) => {
    const day = click.createdAt.toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const topLinks = links
    .map((l) => ({ id: l.id, shortCode: l.shortCode, originalUrl: l.originalUrl, clicks: l._count.clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  res.json({ totalClicks, totalLinks, activeLinks, clicksByDay: Object.entries(clicksByDay).map(([date, count]) => ({ date, count })), topLinks });
}));

export default router;
