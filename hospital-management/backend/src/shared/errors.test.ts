import { describe, it, expect } from 'vitest';
import { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, ConflictError } from './errors';

describe('Custom Errors', () => {
  it('NotFoundError has 404 status', () => {
    const err = new NotFoundError('Patient');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Patient not found');
    expect(err.isOperational).toBe(true);
  });

  it('BadRequestError has 400 status', () => {
    const err = new BadRequestError('Invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.isOperational).toBe(true);
  });

  it('UnauthorizedError has 401 status', () => {
    const err = new UnauthorizedError('No token');
    expect(err.statusCode).toBe(401);
    expect(err.isOperational).toBe(true);
  });

  it('ForbiddenError has 403 status', () => {
    const err = new ForbiddenError('No access');
    expect(err.statusCode).toBe(403);
    expect(err.isOperational).toBe(true);
  });

  it('ConflictError has 409 status', () => {
    const err = new ConflictError('Duplicate');
    expect(err.statusCode).toBe(409);
    expect(err.isOperational).toBe(true);
  });
});
