import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, UnauthorizedError, ForbiddenError, ValidationError, BadRequestError, ConflictError } from '../shared/errors';

describe('shared/errors', () => {
  describe('AppError', () => {
    it('creates an error with correct properties', () => {
      const err = new AppError(400, 'CUSTOM', 'Something went wrong');
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('CUSTOM');
      expect(err.message).toBe('Something went wrong');
      expect(err.name).toBe('AppError');
      expect(err instanceof Error).toBe(true);
    });

    it('accepts optional details', () => {
      const err = new AppError(422, 'VALIDATION', 'Invalid', { field: 'email' });
      expect(err.details).toEqual({ field: 'email' });
    });
  });

  describe('NotFoundError', () => {
    it('creates a 404 error with resource name', () => {
      const err = new NotFoundError('Booking');
      expect(err.statusCode).toBe(404);
      expect(err.code).toBe('NOT_FOUND');
      expect(err.message).toBe('Booking not found');
    });

    it('includes id when provided', () => {
      const err = new NotFoundError('Booking', 'abc-123');
      expect(err.message).toBe('Booking with id abc-123 not found');
    });
  });

  describe('UnauthorizedError', () => {
    it('creates a 401 error with default message', () => {
      const err = new UnauthorizedError();
      expect(err.statusCode).toBe(401);
      expect(err.message).toBe('Unauthorized');
    });

    it('accepts custom message', () => {
      const err = new UnauthorizedError('Token expired');
      expect(err.message).toBe('Token expired');
    });
  });

  describe('ForbiddenError', () => {
    it('creates a 403 error', () => {
      const err = new ForbiddenError();
      expect(err.statusCode).toBe(403);
      expect(err.message).toBe('Forbidden');
    });
  });

  describe('ValidationError', () => {
    it('creates a 400 error with details', () => {
      const err = new ValidationError('Invalid input', { field: 'name' });
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('VALIDATION_ERROR');
      expect(err.details).toEqual({ field: 'name' });
    });
  });

  describe('BadRequestError', () => {
    it('creates a 400 error', () => {
      const err = new BadRequestError('Bad request');
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('BAD_REQUEST');
    });
  });

  describe('ConflictError', () => {
    it('creates a 409 error', () => {
      const err = new ConflictError('Slot already booked');
      expect(err.statusCode).toBe(409);
      expect(err.code).toBe('CONFLICT');
    });
  });
});
