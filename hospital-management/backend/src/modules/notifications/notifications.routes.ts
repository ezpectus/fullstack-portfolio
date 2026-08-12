import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateQuery } from '../../middleware/validate';
import notificationsService from './notifications.service';
import { listNotificationsQuerySchema } from './notifications.dto';

const router = Router();

router.use(authenticate);

router.get('/', validateQuery(listNotificationsQuerySchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = listNotificationsQuerySchema.parse(req.query);
  const result = await notificationsService.list(req.user!.userId, {
    page: query.page,
    limit: query.limit,
    isRead: query.isRead === 'true' ? true : query.isRead === 'false' ? false : undefined,
  });
  res.json(result);
}));

router.get('/unread-count', asyncHandler(async (req: AuthRequest, res: Response) => {
  const count = await notificationsService.getUnreadCount(req.user!.userId);
  res.json({ count });
}));

router.patch('/:id/read', asyncHandler(async (req: AuthRequest, res: Response) => {
  const notif = await notificationsService.markAsRead(req.params.id, req.user!.userId);
  res.json(notif);
}));

router.patch('/mark-all-read', asyncHandler(async (req: AuthRequest, res: Response) => {
  await notificationsService.markAllAsRead(req.user!.userId);
  res.json({ message: 'All notifications marked as read' });
}));

router.delete('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  await notificationsService.delete(req.params.id, req.user!.userId);
  res.status(204).send();
}));

export default router;
