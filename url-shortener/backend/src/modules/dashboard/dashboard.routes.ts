import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { prisma } from '../../config/db';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const [totalLinks, activeLinks, totalClicks] = await Promise.all([
    prisma.shortLink.count({ where: { userId } }),
    prisma.shortLink.count({ where: { userId, status: 'active' } }),
    prisma.click.count({ where: { shortLink: { userId } } }),
  ]);

  const last30DaysClicks = await prisma.click.findMany({
    where: { shortLink: { userId }, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const clicksByDay = last30DaysClicks.reduce((acc: Record<string, number>, click) => {
    const day = click.createdAt.toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const topLinks = await prisma.shortLink.findMany({
    where: { userId },
    include: { _count: { select: { clicks: true } } },
    orderBy: { clicks: { _count: 'desc' } },
    take: 5,
  });

  const recentLinks = await prisma.shortLink.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  res.json({
    totalLinks,
    activeLinks,
    totalClicks,
    clicksByDay: Object.entries(clicksByDay).map(([date, count]) => ({ date, count })),
    topLinks: topLinks.map((l) => ({ id: l.id, shortCode: l.shortCode, originalUrl: l.originalUrl, clicks: l._count.clicks })),
    recentLinks: recentLinks.map((l) => ({ id: l.id, shortCode: l.shortCode, originalUrl: l.originalUrl, createdAt: l.createdAt })),
  });
}));

export default router;
