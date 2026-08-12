import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery } from '../../middleware/validate';
import doctorsService from './doctors.service';
import { createDoctorSchema, updateDoctorSchema, listDoctorsQuerySchema } from './doctors.dto';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = listDoctorsQuerySchema.parse(req.query);
  const result = await doctorsService.list(query);
  res.json(result);
}));

router.get('/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const doctor = await doctorsService.getById(req.params.id);
  res.json(doctor);
}));

router.post('/', authenticate, authorize('ADMIN'), validateBody(createDoctorSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const doctor = await doctorsService.create(req.body);
  res.status(201).json(doctor);
}));

router.patch('/:id', authenticate, authorize('ADMIN', 'RECEPTIONIST'), validateBody(updateDoctorSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const doctor = await doctorsService.update(req.params.id, req.body);
  res.json(doctor);
}));

router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(async (req: AuthRequest, res: Response) => {
  await doctorsService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
