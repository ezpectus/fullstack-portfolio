import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { ForbiddenError } from '../shared/errors';
import { ROLES } from '../shared/constants';

export const requireRole = (...roles: (typeof ROLES)[number][]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('Not authenticated'));
    }
    if (!roles.includes(req.user.role as (typeof ROLES)[number])) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
};
