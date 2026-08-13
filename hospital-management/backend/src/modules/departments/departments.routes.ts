import { Router, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middleware/auth';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import departmentsService from './departments.service';
import { createDepartmentSchema, updateDepartmentSchema, listDepartmentsQuerySchema } from './departments.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, authorize('ADMIN', 'RECEPTIONIST', 'DOCTOR'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = listDepartmentsQuerySchema.parse(req.query);
  const result = await departmentsService.list(query);
  res.json(result);
}));

router.get('/:id', authenticate, validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const dept = await departmentsService.getById(req.params.id);
  res.json(dept);
}));

router.post('/', authenticate, authorize('ADMIN', 'RECEPTIONIST'), validateBody(createDepartmentSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const dept = await departmentsService.create(req.body);
  res.status(201).json(dept);
}));

router.patch('/:id', authenticate, authorize('ADMIN', 'RECEPTIONIST'), validateParams(idParamSchema), validateBody(updateDepartmentSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  const dept = await departmentsService.update(req.params.id, req.body);
  res.json(dept);
}));

router.delete('/:id', authenticate, authorize('ADMIN'), validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res: Response) => {
  await departmentsService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
