import { Router } from 'express';
import { z } from 'zod';
import employeesService from './employees.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { createEmployeeSchema, updateEmployeeSchema, listEmployeesSchema } from './employees.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateQuery(listEmployeesSchema), asyncHandler(async (req, res) => {
  const result = await employeesService.list(req.query as Record<string, string>);
  res.json(result);
}));

router.get('/org-structure', authenticate, authorize('HR_ADMIN', 'MANAGER'), asyncHandler(async (_req, res) => {
  const tree = await employeesService.getOrgStructure();
  res.json(tree);
}));

router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res) => {
  const emp = await employeesService.getByUserId(req.user!.userId);
  res.json(emp);
}));

router.get('/:id', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const emp = await employeesService.getById(req.params.id);
  res.json(emp);
}));

router.post('/', authenticate, authorize('HR_ADMIN'), validateBody(createEmployeeSchema), asyncHandler(async (req, res) => {
  const emp = await employeesService.create(req.body);
  res.status(201).json(emp);
}));

router.patch('/:id', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), validateBody(updateEmployeeSchema), asyncHandler(async (req, res) => {
  const emp = await employeesService.update(req.params.id, req.body);
  res.json(emp);
}));

router.delete('/:id', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  await employeesService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
