import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Health Check', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('Auth Endpoints', () => {
  it('POST /api/auth/register validates input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'invalid' });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login validates input', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '' });
    expect(res.status).toBe(400);
  });
});

describe('Protected Endpoints', () => {
  it('GET /api/customers returns 401 without auth', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(401);
  });

  it('GET /api/deals returns 401 without auth', async () => {
    const res = await request(app).get('/api/deals');
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard/stats returns 401 without auth', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(401);
  });
});
