import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Health Check', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth Endpoints', () => {
  it('POST /api/auth/register validates input', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'not-an-email',
      password: '123',
      name: '',
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login validates input', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: '',
      password: '',
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/auth/me requires authentication', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Protected Routes', () => {
  it('GET /api/employees requires authentication', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(401);
  });

  it('GET /api/departments requires authentication', async () => {
    const res = await request(app).get('/api/departments');
    expect(res.status).toBe(401);
  });

  it('GET /api/leave requires authentication', async () => {
    const res = await request(app).get('/api/leave');
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard/stats requires authentication', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(401);
  });
});
