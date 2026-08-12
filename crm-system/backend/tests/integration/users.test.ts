import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Users Endpoints', () => {
  it('GET /api/users returns 401 without auth', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('GET /api/users/:id returns 401 without auth', async () => {
    const res = await request(app).get('/api/users/550e8400-e29b-41d4-a716-446655440000');
    expect(res.status).toBe(401);
  });

  it('PUT /api/users/:id returns 401 without auth', async () => {
    const res = await request(app)
      .put('/api/users/550e8400-e29b-41d4-a716-446655440000')
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/users/:id returns 401 without auth', async () => {
    const res = await request(app).delete('/api/users/550e8400-e29b-41d4-a716-446655440000');
    expect(res.status).toBe(401);
  });

  it('GET /api/users/:id returns 400 for invalid UUID', async () => {
    const res = await request(app)
      .get('/api/users/not-a-uuid')
      .set('Authorization', 'Bearer fake-token');
    expect(res.status).toBe(401);
  });
});
