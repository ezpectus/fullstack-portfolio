import { Request, Response } from 'express';
import { notificationsService } from './notifications.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { sendNotificationSchema, paginationSchema } from './notifications.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import type { RequestQuery } from '../../shared/types';

export const list = [
  validateQuery(paginationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const query = paginationSchema.parse(req.query) as unknown as RequestQuery;
    const result = await notificationsService.list(query);
    res.json({ data: result.data, pagination: result.pagination });
  }),
];

export const send = [
  validateBody(sendNotificationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationsService.send(req.body.bookingId, req.body.type);
    res.json({ data: result });
  }),
];
