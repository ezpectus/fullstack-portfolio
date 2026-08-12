import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError, ConflictError } from './errors';

describe('Custom Errors', () => {
  it('AppError has correct properties', () => {
    const err = new AppError(500, 'INTERNAL', 'Test error');
    expect(err.message).toBe('Test error');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe('INTERNAL');
  });

  it('NotFoundError has 404 status', () => {
    const err = new NotFoundError('User');
    expect(err.statusCode).toBe(404);
    expect(err.message).toContain('User');
  });

  it('UnauthorizedError has 401 status', () => {
    const err = new UnauthorizedError('No token');
    expect(err.statusCode).toBe(401);
  });

  it('ForbiddenError has 403 status', () => {
    const err = new ForbiddenError('Access denied');
    expect(err.statusCode).toBe(403);
  });

  it('BadRequestError has 400 status', () => {
    const err = new BadRequestError('Invalid input');
    expect(err.statusCode).toBe(400);
  });

  it('ConflictError has 409 status', () => {
    const err = new ConflictError('Duplicate');
    expect(err.statusCode).toBe(409);
  });
});
