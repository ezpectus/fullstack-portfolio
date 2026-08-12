import { Router, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import patientsService from './patients.service';
import { createPatientSchema, updatePatientSchema, listPatientsQuerySchema } from './patients.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = listPatientsQuerySchema.parse(req.query);
  const result = await patientsService.list(query);
  res.json(result);
}));

router.get('/:id', authenticate, validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const patient = await patientsService.getById(req.params.id);
  res.json(patient);
}));

router.post('/', authenticate, authorize('ADMIN', 'RECEPTIONIST'), validateBody(createPatientSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const patient = await patientsService.create(req.body);
  res.status(201).json(patient);
}));

router.patch('/:id', authenticate, authorize('ADMIN', 'RECEPTIONIST', 'DOCTOR'), validateParams(idParamSchema), validateBody(updatePatientSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const patient = await patientsService.update(req.params.id, req.body);
  res.json(patient);
}));

router.delete('/:id', authenticate, authorize('ADMIN'), validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  await patientsService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
