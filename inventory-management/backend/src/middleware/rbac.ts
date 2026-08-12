import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../shared/errors';

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ForbiddenError('Not authenticated'));
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
};
