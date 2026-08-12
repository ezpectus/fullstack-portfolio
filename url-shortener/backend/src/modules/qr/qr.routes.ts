import { Router, Response } from 'express';
import { z } from 'zod';
import QRCode from 'qrcode';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateParams } from '../../middleware/validate';
import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { NotFoundError } from '../../shared/errors';

const router = Router();

const idParamSchema = z.object({ id: z.string().uuid() });

router.use(authenticate);

router.get('/:id', validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const link = await prisma.shortLink.findUnique({ where: { id: req.params.id } });
  if (!link || link.userId !== req.user!.id) throw new NotFoundError('Link');

  const shortUrl = `${env.shortDomain}/${link.shortCode}`;
  const qrBuffer = await QRCode.toDataURL(shortUrl, { width: 300, margin: 2 });

  res.json({ qrCode: qrBuffer, shortUrl });
}));

router.get('/:id/png', validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const link = await prisma.shortLink.findUnique({ where: { id: req.params.id } });
  if (!link || link.userId !== req.user!.id) throw new NotFoundError('Link');

  const shortUrl = `${env.shortDomain}/${link.shortCode}`;
  const pngBuffer = await QRCode.toBuffer(shortUrl, { type: 'png', width: 300, margin: 2 });

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', `attachment; filename="${link.shortCode}-qr.png"`);
  res.send(pngBuffer);
}));

router.get('/:id/svg', validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const link = await prisma.shortLink.findUnique({ where: { id: req.params.id } });
  if (!link || link.userId !== req.user!.id) throw new NotFoundError('Link');

  const shortUrl = `${env.shortDomain}/${link.shortCode}`;
  const svgString = await QRCode.toString(shortUrl, { type: 'svg', width: 300, margin: 2 });

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Disposition', `attachment; filename="${link.shortCode}-qr.svg"`);
  res.send(svgString);
}));

export default router;
