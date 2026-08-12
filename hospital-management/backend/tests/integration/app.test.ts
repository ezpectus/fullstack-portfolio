import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../../src/config/db', () => ({
  prisma: {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    user: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn(), count: vi.fn(), findMany: vi.fn(), update: vi.fn(), delete: vi.fn() },
    refreshToken: { create: vi.fn(), findUnique: vi.fn(), delete: vi.fn(), deleteMany: vi.fn() },
    doctor: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
    patient: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
    department: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn() },
    appointment: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
    medicalRecord: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn() },
    notification: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), updateMany: vi.fn(), delete: vi.fn(), count: vi.fn() },
    workingHours: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    timeOff: { findMany: vi.fn(), create: vi.fn(), delete: vi.fn() },
    doctorService: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    settings: { findMany: vi.fn(), create: vi.fn(), update: vi.fn(), upsert: vi.fn() },
  },
}));

vi.mock('../../src/config/redis', () => ({
  redis: {
    on: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    quit: vi.fn(),
  },
  acquireLock: vi.fn(),
  releaseLock: vi.fn(),
}));

vi.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: vi.fn(),
  }),
}));

import app from '../../src/app';

describe('Health Check', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/auth/login rejects invalid input', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'invalid', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/auth/register rejects invalid input', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'bad', password: '123', name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/auth/me returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Protected Routes', () => {
  it('GET /api/doctors returns 401 without token', async () => {
    const res = await request(app).get('/api/doctors');
    expect(res.status).toBe(401);
  });

  it('GET /api/patients returns 401 without token', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.status).toBe(401);
  });

  it('GET /api/appointments returns 401 without token', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(401);
  });

  it('GET /api/departments returns 401 without token', async () => {
    const res = await request(app).get('/api/departments');
    expect(res.status).toBe(401);
  });

  it('GET /api/notifications returns 401 without token', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.status).toBe(401);
  });

  it('GET /api/dashboard returns 401 without token', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(401);
  });
});
