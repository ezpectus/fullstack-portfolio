import { Request, Response } from 'express';
import { settingsService } from './settings.service';
import { validateBody } from '../../middleware/validate';
import { updateSettingSchema, bulkUpdateSettingsSchema } from './settings.dto';
import { asyncHandler } from '../../middleware/asyncHandler';

export const getAll = [
  asyncHandler(async (_req: Request, res: Response) => {
    const settings = await settingsService.getAll();
    res.json({ data: settings });
  }),
];

export const getByKey = [
  asyncHandler(async (req: Request, res: Response) => {
    const setting = await settingsService.getByKey(req.params.key);
    res.json({ data: setting });
  }),
];

export const update = [
  validateBody(updateSettingSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const setting = await settingsService.update(req.body.key, req.body.value);
    res.json({ data: setting });
  }),
];

export const bulkUpdate = [
  validateBody(bulkUpdateSettingsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.bulkUpdate(req.body.settings);
    res.json({ data: settings });
  }),
];

export const remove = [
  asyncHandler(async (req: Request, res: Response) => {
    await settingsService.delete(req.params.key);
    res.json({ data: { message: 'Setting deleted' } });
  }),
];
