import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { emailService } from './email.service';

export const sendInvoiceEmail = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const result = await emailService.sendInvoice(req.user!.id, req.params.id);
  res.json(result);
});
