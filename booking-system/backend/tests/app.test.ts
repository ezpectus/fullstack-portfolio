import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Health Check', () => {
  it('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid', password: 'password123', name: 'Test' });
      expect(res.status).toBe(400);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com', password: 'short', name: 'Test' });
      expect(res.status).toBe(400);
    });

    it('should reject missing name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@test.com', password: 'password123' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should reject invalid credentials format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: '' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });
});

describe('Protected Routes', () => {
  it('GET /api/services should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/services');
    expect(res.status).toBe(401);
  });

  it('GET /api/bookings should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/bookings');
    expect(res.status).toBe(401);
  });

  it('GET /api/customers should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(401);
  });

  it('GET /api/providers should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/providers');
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard/overview should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/dashboard/overview');
    expect(res.status).toBe(401);
  });
});
