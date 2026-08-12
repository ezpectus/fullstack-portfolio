import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/asyncHandler';
import { companyService } from './company.service';

export const getCompany = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const company = await companyService.get(req.user!.id);
  res.json(company);
});

export const updateCompany = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
  const company = await companyService.update(req.user!.id, req.body);
  res.json(company);
});
