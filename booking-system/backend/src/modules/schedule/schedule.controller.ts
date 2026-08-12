import { Request, Response } from 'express';
import { scheduleService } from './schedule.service';
import { validateBody, validateQuery } from '../../middleware/validate';
import { blockSlotsSchema, getSlotsSchema } from './schedule.dto';
import { asyncHandler } from '../../middleware/asyncHandler';

export const getSchedule = [
  asyncHandler(async (req: Request, res: Response) => {
    const result = await scheduleService.getProviderSchedule(req.params.providerId, req.query.startDate as string, req.query.endDate as string);
    res.json({ data: result });
  }),
];

export const getSlots = [
  validateQuery(getSlotsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const slots = await scheduleService.getAvailableSlots(req.params.providerId, req.query.date as string, req.query.serviceId as string);
    res.json({ data: slots });
  }),
];

export const block = [
  validateBody(blockSlotsSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const timeOff = await scheduleService.blockSlots(req.body.providerId, req.body.startDate, req.body.endDate, req.body.reason);
    res.status(201).json({ data: timeOff });
  }),
];

export const unblock = [
  asyncHandler(async (req: Request, res: Response) => {
    await scheduleService.unblockSlots(req.params.id);
    res.json({ data: { message: 'Slots unblocked' } });
  }),
];
