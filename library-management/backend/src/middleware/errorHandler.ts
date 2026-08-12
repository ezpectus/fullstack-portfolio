import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors';
import { env } from '../config/env';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
  }

  if (err instanceof AppError) {
    Object.setPrototypeOf(err, AppError.prototype);
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: { code: 'INTERNAL_SERVER_ERROR', message: env.isProduction ? 'Something went wrong' : err.message },
  });
};
