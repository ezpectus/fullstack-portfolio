import { Request, Response, NextFunction } from 'express';
import { ROLES } from '../shared/constants';
import { ForbiddenError } from '../shared/errors';

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }

    next();
  };
}

export const requireAdmin = requireRole(ROLES.ADMIN);
export const requireManager = requireRole(ROLES.ADMIN, ROLES.MANAGER);
