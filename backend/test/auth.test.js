const request = require('supertest');
const app = require('../server');

describe('Auth API Tests', () => {
  test('POST /api/auth/login - valid credentials returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - invalid credentials returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wrong', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
  });
});