import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError, ForbiddenError } from '../shared/errors';
import { ROLES } from '../shared/constants';

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid authorization header'));
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return next(new ForbiddenError('Admin access required'));
  }
  next();
};
