import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import app from '../../server.js';
import Category from '../../models/Category.js';

let server;
const port = 3003;

test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Category.init();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(port, resolve));
});

test.beforeEach(async () => {
  await Category.deleteMany({});
});

test.after(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
});

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

test('GET /api/categories returns all categories', async () => {
  await Category.create({ categoryName: 'Electronics' });

  const res = await fetch(`http://localhost:${port}/api/categories`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
  assert.ok(data.length > 0);
});

test('GET /api/categories/:id returns category if found', async () => {
  const category = await Category.create({ categoryName: 'Books' });

  const res = await fetch(`http://localhost:${port}/api/categories/${category._id}`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.categoryName, 'Books');
});

test('GET /api/categories/:id returns 404 if not found', async () => {
  const fakeId = new mongoose.Types.ObjectId();

  const res = await fetch(`http://localhost:${port}/api/categories/${fakeId}`);
  assert.equal(res.status, 404);
  const data = await res.json();
  assert.deepEqual(data, { error: 'Category not found' });
});

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





