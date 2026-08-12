import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, ValidationError, UnauthorizedError, ForbiddenError, ConflictError } from './errors';

describe('Error classes', () => {
  it('AppError has correct properties', () => {
    const err = new AppError(400, 'CUSTOM', 'Something happened');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('CUSTOM');
    expect(err.message).toBe('Something happened');
  });

  it('NotFoundError has 404 status', () => {
    const err = new NotFoundError('Customer', '123');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toContain('Customer');
    expect(err.message).toContain('123');
  });

  it('ValidationError has 400 status', () => {
    const err = new ValidationError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });

  it('UnauthorizedError has 401 status', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('ForbiddenError has 403 status', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('ConflictError has 409 status', () => {
    const err = new ConflictError('Duplicate');
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
  });
});
