import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Dashboard Endpoints', () => {
  it('GET /api/dashboard/stats returns 401 without auth', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard/deals-by-stage returns 401 without auth', async () => {
    const res = await request(app).get('/api/dashboard/deals-by-stage');
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard/new-customers returns 401 without auth', async () => {
    const res = await request(app).get('/api/dashboard/new-customers');
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard/recent-activity returns 401 without auth', async () => {
    const res = await request(app).get('/api/dashboard/recent-activity');
    expect(res.status).toBe(401);
  });
});
