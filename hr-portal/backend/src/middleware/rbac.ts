import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { UnauthorizedError, ForbiddenError } from '../shared/errors';

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError('Not authenticated'));
    if (!roles.includes(req.user.role)) return next(new ForbiddenError('Insufficient permissions'));
    next();
  };
}

export const authorize = requireRole;
