import { Router } from 'express';
import { z } from 'zod';
import departmentsService from './departments.service';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { createDepartmentSchema, updateDepartmentSchema, listDepartmentsSchema } from './departments.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, validateQuery(listDepartmentsSchema), asyncHandler(async (req, res) => {
  const query = listDepartmentsSchema.parse(req.query);
  const result = await departmentsService.list(query);
  res.json(result);
}));

router.get('/:id', authenticate, validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const dept = await departmentsService.getById(req.params.id);
  res.json(dept);
}));

router.post('/', authenticate, authorize('HR_ADMIN'), validateBody(createDepartmentSchema), asyncHandler(async (req, res) => {
  const dept = await departmentsService.create(req.body);
  res.status(201).json(dept);
}));

router.patch('/:id', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), validateBody(updateDepartmentSchema), asyncHandler(async (req, res) => {
  const dept = await departmentsService.update(req.params.id, req.body);
  res.json(dept);
}));

router.delete('/:id', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  await departmentsService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
