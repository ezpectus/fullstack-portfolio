import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../shared/errors';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('No token provided'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new UnauthorizedError('No token provided'));
  }
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
    req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    next();
  } catch {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
}
