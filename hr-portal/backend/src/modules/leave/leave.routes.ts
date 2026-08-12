import { Router } from 'express';
import { z } from 'zod';
import leaveService from './leave.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { createLeaveRequestSchema, approveLeaveSchema, listLeaveSchema } from './leave.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });
const employeeIdParamSchema = z.object({ employeeId: z.string().uuid() });

router.get('/', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateQuery(listLeaveSchema), asyncHandler(async (req, res) => {
  const query = listLeaveSchema.parse(req.query);
  const result = await leaveService.list(query);
  res.json(result);
}));

router.get('/types', authenticate, asyncHandler(async (_req, res) => {
  const types = await leaveService.getLeaveTypes();
  res.json(types);
}));

const yearSchema = z.object({ year: z.coerce.number().optional() });

router.get('/balance/:employeeId', authenticate, validateParams(employeeIdParamSchema), validateQuery(yearSchema), asyncHandler(async (req, res) => {
  const query = yearSchema.parse(req.query);
  const balance = await leaveService.getBalance(req.params.employeeId, query.year);
  res.json(balance);
}));

router.get('/:id', authenticate, validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const lr = await leaveService.getById(req.params.id);
  res.json(lr);
}));

router.post('/', authenticate, validateBody(createLeaveRequestSchema), asyncHandler(async (req, res) => {
  const lr = await leaveService.create(req.body);
  res.status(201).json(lr);
}));

router.post('/:id/approve', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), validateBody(approveLeaveSchema), asyncHandler(async (req: AuthRequest, res) => {
  const lr = await leaveService.approve(req.params.id, req.body.approved, req.user!.userId, req.body.rejectionReason);
  res.json(lr);
}));

router.post('/:id/cancel', authenticate, validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res) => {
  const lr = await leaveService.cancel(req.params.id, req.user!.userId);
  res.json(lr);
}));

export default router;
