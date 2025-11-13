import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import MockProject from '../mocks/MockProject.js';
import createTestRouter from '../helpers/createTestRouter.js';

const app = express();
app.use(express.json());
app.use('/', createTestRouter(MockProject));

test('POST /projects should return 201 with saved project', async () => {
  const response = await request(app)
    .post('/projects')
    .send({ name: 'test 1', category: 'desk' });

  assert.equal(response.status, 201);
  assert.deepEqual(response.body, {
    name: 'test 1',
    category: 'desk',
    _id: 'mock123',
  });
});
 test('POST /projects should return 400 on save error', async () => {
  const response = await request(app)
    .post('/projects')
    .send({name:'fail'})

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {error: 'Project name is required'});
});

test('PATCH /projects/:id/status should change status', async () => {
    const response = await request(app)
     .patch('/projects/abc123/status')
     .send({status:'archived'});
    
    assert.equal(response.status, 200);
    assert.equal(response.body.status, 'archived');
    assert.equal(response.body._id, 'abc123');
});
test('PATCH /projects/:id/status should return 404 if project not found', async () => {
  const response = await request(app)
    .patch('/projects/missing/status')
    .send({status:'archived'})

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {error: 'Project not found'});
});
