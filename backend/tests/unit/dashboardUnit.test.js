import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import MockProject from '../mocks/MockProject.js';
import createTestRouter from '../helpers/createTestRouter.js';
/**
 * @fileoverview
 * Backend tests for project-related routes using Node.js `test` module.
 * Tests cover the POST and PATCH endpoints for projects, including success and failure scenarios.
 */
const app = express();
app.use(express.json());
app.use('/', createTestRouter(MockProject));
/**
 * Test: POST /projects
 * Should create a new project and return 201 with the saved project object
 */
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
/**
 * Test: POST /projects
 * Should return 400 when project creation fails due to invalid data
 */
 test('POST /projects should return 400 on save error', async () => {
  const response = await request(app)
    .post('/projects')
    .send({name:'fail'})

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {error: 'Project name is required'});
});
/**
 * Test: PATCH /projects/:id/status
 * Should update the status of an existing project and return 200
 */
test('PATCH /projects/:id/status should change status', async () => {
    const response = await request(app)
     .patch('/projects/abc123/status')
     .send({status:'archived'});
    
    assert.equal(response.status, 200);
    assert.equal(response.body.status, 'archived');
    assert.equal(response.body._id, 'abc123');
});
/**
 * Test: PATCH /projects/:id/status
 * Should return 404 if the project to update does not exist
 */
test('PATCH /projects/:id/status should return 404 if project not found', async () => {
  const response = await request(app)
    .patch('/projects/missing/status')
    .send({status:'archived'})

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {error: 'Project not found'});
});
