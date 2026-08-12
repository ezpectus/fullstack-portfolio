import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Notes Endpoints', () => {
  it('GET /api/notes returns 401 without auth', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).toBe(401);
  });

  it('POST /api/notes returns 401 without auth', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({ content: 'Test note' });
    expect(res.status).toBe(401);
  });

  it('GET /api/notes/:id returns 401 without auth', async () => {
    const res = await request(app).get('/api/notes/550e8400-e29b-41d4-a716-446655440000');
    expect(res.status).toBe(401);
  });

  it('PUT /api/notes/:id returns 401 without auth', async () => {
    const res = await request(app)
      .put('/api/notes/550e8400-e29b-41d4-a716-446655440000')
      .send({ content: 'Updated note' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/notes/:id returns 401 without auth', async () => {
    const res = await request(app).delete('/api/notes/550e8400-e29b-41d4-a716-446655440000');
    expect(res.status).toBe(401);
  });

  it('PATCH /api/notes/:id/pin returns 401 without auth', async () => {
    const res = await request(app).patch('/api/notes/550e8400-e29b-41d4-a716-446655440000/pin');
    expect(res.status).toBe(401);
  });
});
