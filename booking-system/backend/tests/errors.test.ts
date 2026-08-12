import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, UnauthorizedError, ForbiddenError, ValidationError, BadRequestError, ConflictError } from '../src/shared/errors';

describe('Error Classes', () => {
  it('AppError should have correct properties', () => {
    const err = new AppError(400, 'CUSTOM', 'Custom error', { field: 'value' });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('CUSTOM');
    expect(err.message).toBe('Custom error');
    expect(err.details).toEqual({ field: 'value' });
    expect(err.name).toBe('AppError');
    expect(err).toBeInstanceOf(Error);
  });

  it('NotFoundError should have 404 status', () => {
    const err = new NotFoundError('Booking');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toContain('Booking');
  });

  it('NotFoundError should include id when provided', () => {
    const err = new NotFoundError('Booking', 'abc-123');
    expect(err.message).toContain('abc-123');
  });

  it('UnauthorizedError should have 401 status', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
  });

  it('ForbiddenError should have 403 status', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('ValidationError should have 400 status and details', () => {
    const err = new ValidationError('Invalid input', { email: 'required' });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.details).toEqual({ email: 'required' });
  });

  it('BadRequestError should have 400 status', () => {
    const err = new BadRequestError('Bad request');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('BAD_REQUEST');
  });

  it('ConflictError should have 409 status', () => {
    const err = new ConflictError('Slot already booked');
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
  });
});
