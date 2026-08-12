import { Router, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import appointmentsService from './appointments.service';
import { createAppointmentSchema, updateAppointmentStatusSchema, listAppointmentsQuerySchema } from './appointments.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = listAppointmentsQuerySchema.parse(req.query);
  const result = await appointmentsService.list(query);
  res.json(result);
}));

router.get('/:id', authenticate, validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const appt = await appointmentsService.getById(req.params.id);
  res.json(appt);
}));

router.post('/', authenticate, authorize('ADMIN', 'RECEPTIONIST', 'DOCTOR'), validateBody(createAppointmentSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const appt = await appointmentsService.create(req.body);
  res.status(201).json(appt);
}));

router.patch('/:id', authenticate, authorize('ADMIN', 'RECEPTIONIST', 'DOCTOR'), validateParams(idParamSchema), validateBody(updateAppointmentStatusSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const appt = await appointmentsService.update(req.params.id, req.body);
  res.json(appt);
}));

router.delete('/:id', authenticate, authorize('ADMIN', 'RECEPTIONIST'), validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  await appointmentsService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
