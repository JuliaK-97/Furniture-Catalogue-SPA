import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import app from '../../server.js';
import Category from '../../models/Category.js';
/**
 * @fileoverview
 * Integration tests for Category API routes, including:
 * - Creating, reading, updating, and deleting categories
 * - Handling duplicate names and 404 errors
 */
let server;
const port = 3003;
/**
 * Before all tests:
 * - Connect to MongoDB
 * - Initialize the Category model (ensure indexes)
 * - Start HTTP server
 */
test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Category.init();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(port, resolve));
});
/**
 * Before each test:
 * - Clear the Category collection to ensure test isolation
 */
test.beforeEach(async () => {
  await Category.deleteMany({});
});
/**
 * After all tests:
 * - Close MongoDB connection
 * - Stop HTTP server
 */
test.after(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
});
/**
 * Test: POST /api/categories
 * Creates a new category
 * Expects 201 status and correct categoryName
 */
test('POST /api/categories creates a new category', async () => {
  const res = await fetch(`http://localhost:${port}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoryName: 'Furniture' })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.categoryName, 'Furniture');
});
/**
 * Test: POST /api/categories with duplicate name
 * Expects 409 status and error message
 */
test('POST /api/categories returns 409 if duplicate name', async () => {
  await fetch(`http://localhost:${port}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoryName: 'Duplicate' })
  });

  const res = await fetch(`http://localhost:${port}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoryName: 'Duplicate' })
  });

  assert.equal(res.status, 409);
  const data = await res.json();
  assert.deepEqual(data, { error: 'Category name already exists' });
});
/**
 * Test: GET /api/categories
 * Returns all categories
 * Expects 200 status and non-empty array
 */
test('GET /api/categories returns all categories', async () => {
  await Category.create({ categoryName: 'Electronics' });

  const res = await fetch(`http://localhost:${port}/api/categories`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
  assert.ok(data.length > 0);
});
/**
 * Test: GET /api/categories/:id
 * Returns category if found
 * Expects 200 status and correct category name
 */
test('GET /api/categories/:id returns category if found', async () => {
  const category = await Category.create({ categoryName: 'Books' });

  const res = await fetch(`http://localhost:${port}/api/categories/${category._id}`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.categoryName, 'Books');
});
/**
 * Test: GET /api/categories/:id for non-existent category
 * Expects 404 status and error message
 */
test('GET /api/categories/:id returns 404 if not found', async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const res = await fetch(`http://localhost:${port}/api/categories/${fakeId}`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.deepEqual(data, { error: 'Category not found' });
});
/**
 * Test: PATCH /api/categories/:id
 * Updates category name
 * Expects 200 status and updated categoryName
 */
test('PATCH /api/categories/:id updates category', async () => {
  const category = await Category.create({ categoryName: 'OldName' });

  const res = await fetch(`http://localhost:${port}/api/categories/${category._id.toString()}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ categoryName: 'NewName' })

  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.categoryName, 'NewName');
});
/**
 * Test: DELETE /api/categories/:id
 * Deletes category
 * Expects 200 status, confirmation message, and removed from DB
 */
test('DELETE /api/categories/:id deletes category', async () => {
  const category = await Category.create({ categoryName: 'ToDelete' });

  const res = await fetch(`http://localhost:${port}/api/categories/${category._id}`, {
    method: 'DELETE'
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, { message: 'Category deleted' });

  const exists = await Category.findById(category._id);
  assert.equal(exists, null);
});





