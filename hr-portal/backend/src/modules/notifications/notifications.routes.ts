import { Router } from 'express';
import { z } from 'zod';
import notificationsService from './notifications.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateParams } from '../../middleware/validate';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;
  const result = await notificationsService.list(req.user!.userId, {
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    isRead,
  });
  res.json(result);
}));

router.get('/unread-count', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const count = await notificationsService.getUnreadCount(req.user!.userId);
  res.json({ count });
}));

router.post('/:id/read', authenticate, validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res) => {
  const notif = await notificationsService.markAsRead(req.params.id, req.user!.userId);
  res.json(notif);
}));

router.post('/read-all', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  await notificationsService.markAllAsRead(req.user!.userId);
  res.status(204).send();
}));

router.delete('/:id', authenticate, validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res) => {
  await notificationsService.delete(req.params.id, req.user!.userId);
  res.status(204).send();
}));

export default router;
