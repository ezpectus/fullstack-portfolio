import { Request, Response } from 'express';
import { settingsService } from './settings.service';
import { validateBody } from '../../middleware/validate';
import { upsertSettingSchema, bulkUpsertSchema } from './settings.dto';
import { asyncHandler } from '../../middleware/asyncHandler';
import { AuthRequest } from '../../middleware/auth';

export const list = [
  asyncHandler(async (_req: Request, res: Response) => {
    const settings = await settingsService.list();
    res.json({ data: settings });
  }),
];

export const getByKey = [
  asyncHandler(async (req: Request, res: Response) => {
    const setting = await settingsService.getByKey(req.params.key);
    res.json({ data: setting });
  }),
];

export const upsert = [
  validateBody(upsertSettingSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const setting = await settingsService.upsert(req.body.key, req.body.value, req.user?.id);
    res.json({ data: setting });
  }),
];

export const bulkUpsert = [
  validateBody(bulkUpsertSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const settings = await settingsService.bulkUpsert(req.body, req.user?.id);
    res.json({ data: settings });
  }),
];
