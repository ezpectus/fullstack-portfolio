import { Router, Response } from 'express';
import { z } from 'zod';
import { AuthRequest, authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import medicalRecordsService from './medicalRecords.service';
import { createMedicalRecordSchema, updateMedicalRecordSchema, listMedicalRecordsQuerySchema } from './medicalRecords.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });
const appointmentIdParamSchema = z.object({ appointmentId: z.string().uuid() });

router.use(authenticate);

router.get('/', authorize('ADMIN', 'DOCTOR'), validateQuery(listMedicalRecordsQuerySchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = listMedicalRecordsQuerySchema.parse(req.query);
  const result = await medicalRecordsService.list(query);
  res.json(result);
}));

router.get('/appointment/:appointmentId', validateParams(appointmentIdParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const record = await medicalRecordsService.getByAppointmentId(req.params.appointmentId);
  res.json(record);
}));

router.get('/:id', validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const record = await medicalRecordsService.getById(req.params.id);
  res.json(record);
}));

router.post('/', authorize('ADMIN', 'DOCTOR'), validateBody(createMedicalRecordSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const record = await medicalRecordsService.create(req.body);
  res.status(201).json(record);
}));

router.patch('/:id', authorize('ADMIN', 'DOCTOR'), validateParams(idParamSchema), validateBody(updateMedicalRecordSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const record = await medicalRecordsService.update(req.params.id, req.body);
  res.json(record);
}));

router.delete('/:id', authorize('ADMIN', 'DOCTOR'), validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  await medicalRecordsService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
