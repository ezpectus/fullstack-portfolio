import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { prisma } from '../../config/db';
import { validateBody } from '../../middleware/validate';
import { z } from 'zod';

const router = Router();

const settingsSchema = z.object({
  domain: z.string().min(1).optional(),
  codeLength: z.number().int().min(4).max(12).optional(),
  blacklist: z.array(z.string()).optional(),
});

router.use(authenticate);

router.get('/', asyncHandler(async (req: AuthRequest, res: Response) => {
  let settings = await prisma.settings.findUnique({ where: { userId: req.user!.id } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { userId: req.user!.id } });
  }
  res.json(settings);
}));

router.put('/', validateBody(settingsSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const settings = await prisma.settings.upsert({
    where: { userId: req.user!.id },
    create: { userId: req.user!.id, ...req.body },
    update: { ...req.body },
  });
  res.json(settings);
}));

export default router;
