import { Router } from 'express';
import { z } from 'zod';
import payrollService from './payroll.service';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validateBody, validateQuery, validateParams } from '../../middleware/validate';
import { createPayslipSchema, updatePayslipSchema, listPayslipSchema } from './payroll.dto';

const router = Router();
const idParamSchema = z.object({ id: z.string().uuid() });

router.get('/', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateQuery(listPayslipSchema), asyncHandler(async (req, res) => {
  const result = await payrollService.list(req.query as Record<string, string>);
  res.json(result);
}));

router.get('/fund', authenticate, authorize('HR_ADMIN'), asyncHandler(async (_req, res) => {
  const fund = await payrollService.getSalaryFund();
  res.json(fund);
}));

router.get('/:id', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const slip = await payrollService.getById(req.params.id);
  res.json(slip);
}));

router.get('/:id/pdf', authenticate, authorize('HR_ADMIN', 'MANAGER'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const pdf = await payrollService.getPayslipPDF(req.params.id);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="payslip.pdf"`);
  res.send(pdf);
}));

router.post('/', authenticate, authorize('HR_ADMIN'), validateBody(createPayslipSchema), asyncHandler(async (req, res) => {
  const slip = await payrollService.create(req.body);
  res.status(201).json(slip);
}));

router.patch('/:id', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), validateBody(updatePayslipSchema), asyncHandler(async (req, res) => {
  const slip = await payrollService.update(req.params.id, req.body);
  res.json(slip);
}));

router.post('/:id/approve', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), asyncHandler(async (req: AuthRequest, res) => {
  const slip = await payrollService.approve(req.params.id, req.user!.userId);
  res.json(slip);
}));

router.post('/:id/pay', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  const slip = await payrollService.markPaid(req.params.id);
  res.json(slip);
}));

router.delete('/:id', authenticate, authorize('HR_ADMIN'), validateParams(idParamSchema), asyncHandler(async (req, res) => {
  await payrollService.delete(req.params.id);
  res.status(204).send();
}));

export default router;
