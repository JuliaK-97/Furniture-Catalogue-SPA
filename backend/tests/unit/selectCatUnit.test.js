import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import MockCategory from '../mocks/MockCategory.js';
import createTestRouter2 from '../helpers/createTestRouter2.js';

const app = express();
app.use(express.json());
app.use('/', createTestRouter2(MockCategory));

test('POST /categories should return 201 with saved category', async () => {
  const response = await request(app)
    .post('/categories')
    .send({ categoryName: 'chairs', projectId: 'proj123' });

  assert.equal(response.status, 201);
  assert.equal(response.body._id, 'mockCat123');
});

test('POST /categories should return 409 on duplicate name', async () => {
  const response = await request(app)
    .post('/categories')
    .send({ categoryName: 'duplicate', projectId: 'proj123' });

  assert.equal(response.status, 409);
  assert.deepEqual(response.body, { error: 'Category name already exists' });
});

test('PATCH /categories/:id should update category', async () => {
  const response = await request(app)
    .patch('/categories/abc123')
    .send({ categoryName: 'updated' });

  assert.equal(response.status, 200);
  assert.equal(response.body.categoryName, 'updated');
});

test('PATCH /categories/:id should return 404 if not found', async () => {
  const response = await request(app)
    .patch('/categories/missing')
    .send({ categoryName: 'updated' });

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Category not found' });
});

test('DELETE /categories/:id should delete category', async () => {
  const response = await request(app)
    .delete('/categories/abc123');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: 'Category deleted' });
});

test('DELETE /categories/:id should return 404 if not found', async () => {
  const response = await request(app)
    .delete('/categories/missing');

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Category not found' });
});
