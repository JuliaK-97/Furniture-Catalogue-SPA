import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express from 'express';
import MockCategory from '../mocks/MockCategory.js';
import createTestRouter2 from '../helpers/createTestRouter2.js';
/**
 * @fileoverview
 * Backend tests for category-related routes using Node.js `test` module.
 * Tests cover the POST, PATCH, and DELETE endpoints for categories, including success, conflict, validation, and not-found scenarios.
 */
const app = express();
app.use(express.json());
app.use('/', createTestRouter2(MockCategory));
/**
 * Test: POST /categories
 * Should create a new category and return 201 with the saved category object
 */
test('POST /categories should return 201 with saved category', async () => {
  const response = await request(app)
    .post('/categories')
    .send({ categoryName: 'chairs', projectId: 'proj123' });

  assert.equal(response.status, 201);
  assert.equal(response.body._id, 'mockCat123');
});
/**
 * Test: POST /categories
 * Should return 409 if a category with the same name already exists
 */

test('POST /categories should return 409 on duplicate name', async () => {
  const response = await request(app)
    .post('/categories')
    .send({ categoryName: 'duplicate', projectId: 'proj123' });

  assert.equal(response.status, 409);
  assert.deepEqual(response.body, { error: 'Category name already exists' });
});
/**
 * Test: POST /categories
 * Should return 400 when category creation fails due to missing or invalid data
 */
test('POST /categories should return 400 on validation error', async () => {
  const response = await request(app)
    .post('/categories')
    .send({}); 

  assert.equal(response.status, 400);
  assert.ok(response.body.error); 
});
/**
 * Test: PATCH /categories/:id
 * Should update an existing category and return 200 with updated object
 */
test('PATCH /categories/:id should update category', async () => {
  const response = await request(app)
    .patch('/categories/abc123')
    .send({ categoryName: 'updated' });

  assert.equal(response.status, 200);
  assert.equal(response.body.categoryName, 'updated');
});
/**
 * Test: PATCH /categories/:id
 * Should return 404 if the category to update does not exist
 */
test('PATCH /categories/:id should return 404 if not found', async () => {
  const response = await request(app)
    .patch('/categories/missing')
    .send({ categoryName: 'updated' });

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Category not found' });
});
/**
 * Test: DELETE /categories/:id
 * Should delete an existing category and return 200 with a success message
 */
test('DELETE /categories/:id should delete category', async () => {
  const response = await request(app)
    .delete('/categories/abc123');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: 'Category deleted' });
});
/**
 * Test: DELETE /categories/:id
 * Should return 404 if the category to delete does not exist
 */
test('DELETE /categories/:id should return 404 if not found', async () => {
  const response = await request(app)
    .delete('/categories/missing');

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: 'Category not found' });
});
