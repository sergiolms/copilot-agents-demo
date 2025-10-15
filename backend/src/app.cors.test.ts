import request from 'supertest';
import app from './app.js';
import { describe, it, expect } from 'vitest';

describe('CORS', () => {
  it('sets Access-Control-Allow-Origin for GET', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('responds to OPTIONS preflight', async () => {
    const res = await request(app)
      .options('/api/health')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');
  // For express + cors middleware, supertest OPTIONS may return 204 or 200 depending on version
  expect([200,204]).toContain(res.status);
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });
});
