import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody } from '../../middleware/validate';
import scheduleService from './schedule.service';
import { createWorkingHoursSchema, createTimeOffSchema, createServiceSchema } from './schedule.dto';

const router = Router();

router.get('/:doctorId/working-hours', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const hours = await scheduleService.getWorkingHours(req.params.doctorId);
  res.json(hours);
}));

router.post('/:doctorId/working-hours', authenticate, authorize('ADMIN', 'DOCTOR'), validateBody(createWorkingHoursSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const hours = await scheduleService.addWorkingHours(req.params.doctorId, req.body);
  res.status(201).json(hours);
}));

router.patch('/working-hours/:id', authenticate, authorize('ADMIN', 'DOCTOR'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const hours = await scheduleService.updateWorkingHours(req.params.id, req.body);
  res.json(hours);
}));

router.delete('/working-hours/:id', authenticate, authorize('ADMIN', 'DOCTOR'), asyncHandler(async (req: AuthRequest, res: Response) => {
  await scheduleService.deleteWorkingHours(req.params.id);
  res.status(204).send();
}));

router.get('/:doctorId/time-off', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const timeOff = await scheduleService.getTimeOff(req.params.doctorId);
  res.json(timeOff);
}));

router.post('/:doctorId/time-off', authenticate, authorize('ADMIN', 'DOCTOR'), validateBody(createTimeOffSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const timeOff = await scheduleService.addTimeOff(req.params.doctorId, req.body);
  res.status(201).json(timeOff);
}));

router.delete('/time-off/:id', authenticate, authorize('ADMIN', 'DOCTOR'), asyncHandler(async (req: AuthRequest, res: Response) => {
  await scheduleService.deleteTimeOff(req.params.id);
  res.status(204).send();
}));

router.get('/:doctorId/services', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const services = await scheduleService.getServices(req.params.doctorId);
  res.json(services);
}));

router.post('/:doctorId/services', authenticate, authorize('ADMIN', 'DOCTOR'), validateBody(createServiceSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const service = await scheduleService.addService(req.params.doctorId, req.body);
  res.status(201).json(service);
}));

router.patch('/services/:id', authenticate, authorize('ADMIN', 'DOCTOR'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const service = await scheduleService.updateService(req.params.id, req.body);
  res.json(service);
}));

router.delete('/services/:id', authenticate, authorize('ADMIN', 'DOCTOR'), asyncHandler(async (req: AuthRequest, res: Response) => {
  await scheduleService.deleteService(req.params.id);
  res.status(204).send();
}));

export default router;
