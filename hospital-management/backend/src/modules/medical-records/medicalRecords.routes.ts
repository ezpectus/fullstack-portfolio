import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery } from '../../middleware/validate';
import medicalRecordsService from './medicalRecords.service';
import { createMedicalRecordSchema, updateMedicalRecordSchema, listMedicalRecordsQuerySchema } from './medicalRecords.dto';

const router = Router();

router.use(authenticate);

router.get('/', validateQuery(listMedicalRecordsQuerySchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await medicalRecordsService.list(req.query as any);
  res.json(result);
}));

router.get('/appointment/:appointmentId', asyncHandler(async (req: AuthRequest, res: Response) => {
  const record = await medicalRecordsService.getByAppointmentId(req.params.appointmentId);
  res.json(record);
}));

router.get('/:id', asyncHandler(async (req: AuthRequest, res: Response) => {
  const record = await medicalRecordsService.getById(req.params.id);
  res.json(record);
}));

router.post('/', authorize('ADMIN', 'DOCTOR'), validateBody(createMedicalRecordSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const record = await medicalRecordsService.create(req.body);
  res.status(201).json(record);
}));

router.patch('/:id', authorize('ADMIN', 'DOCTOR'), validateBody(updateMedicalRecordSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const record = await medicalRecordsService.update(req.params.id, req.body);
  res.json(record);
}));

router.delete('/:id', authorize('ADMIN', 'DOCTOR'), asyncHandler(async (req: AuthRequest, res: Response) => {
  await medicalRecordsService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
