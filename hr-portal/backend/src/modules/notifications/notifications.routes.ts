import { Router } from 'express';
import { z } from 'zod';
import notificationsService from './notifications.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateParams, validateQuery } from '../../middleware/validate';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });
const listNotificationsSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  isRead: z.enum(['true', 'false']).optional(),
});

router.get('/', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateQuery(listNotificationsSchema), asyncHandler(async (req: AuthRequest, res) => {
  const query = listNotificationsSchema.parse(req.query);
  const result = await notificationsService.list(req.user!.userId, {
    page: query.page,
    limit: query.limit,
    isRead: query.isRead === 'true' ? true : query.isRead === 'false' ? false : undefined,
  });
  res.json(result);
}));

router.get('/unread-count', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const count = await notificationsService.getUnreadCount(req.user!.userId);
  res.json({ count });
}));

router.post('/:id/read', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res) => {
  const notif = await notificationsService.markAsRead(req.params.id, req.user!.userId);
  res.json(notif);
}));

router.post('/read-all', authenticate, authorize('HR_ADMIN', 'MANAGER'), asyncHandler(async (req: AuthRequest, res) => {
  await notificationsService.markAllAsRead(req.user!.userId);
  res.status(204).send();
}));

router.delete('/:id', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res) => {
  await notificationsService.delete(req.params.id, req.user!.userId);
  res.status(204).send();
}));

export default router;
