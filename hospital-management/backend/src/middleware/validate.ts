import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
      });
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
      });
    }
    req.query = result.data as any;
    next();
  };
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        },
      });
    }
    req.params = result.data as any;
    next();
  };
}
