import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { pdfService } from './pdf.service';

export const downloadInvoicePdf = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  await pdfService.generateInvoicePdf(req.user!.id, req.params.id, res);
});
