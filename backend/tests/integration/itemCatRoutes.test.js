import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import app from '../../server.js';
import ItemCat from '../../models/ItemCat.js';
import ItemNew from '../../models/ItemNew.js';
import Project from '../../models/Project.js';
import Category from '../../models/Category.js';

let server;
const port = 3005;

test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await ItemCat.init();
  await ItemNew.init();
  await Project.init();
  await Category.init();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(port, resolve));
});

test.beforeEach(async () => {
  await ItemCat.deleteMany({});
  await ItemNew.deleteMany({});
  await Project.deleteMany({});
  await Category.deleteMany({});
});

test.after(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
});

test('POST /api/itemCats creates a new itemCat', async () => {
  const project = await Project.create({ name: 'Test Project' });
  const category = await Category.create({ categoryName: 'Test Category' });

  const res = await fetch(`http://localhost:${port}/api/itemCats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Chair',
      image: 'chair.png',
      categoryId: category._id,
      projectId: project._id
    })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.name, 'Chair');
  assert.equal(data.image, 'chair.png');
});

test('GET /api/itemCats returns all itemCats', async () => {
  const project = await Project.create({ name: 'Proj' });
  const category = await Category.create({ categoryName: 'Cat' });
  await ItemCat.create({ name: 'Desk', image: 'desk.png', projectId: project._id, categoryId: category._id });

  const res = await fetch(`http://localhost:${port}/api/itemCats`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data));
  assert.ok(data.length > 0);
});

test('GET /api/itemCats/:id returns itemCat if found', async () => {
  const project = await Project.create({ name: 'Proj' });
  const category = await Category.create({ categoryName: 'Cat' });
  const itemCat = await ItemCat.create({ name: 'Lamp', image: 'lamp.png', projectId: project._id, categoryId: category._id });

  const res = await fetch(`http://localhost:${port}/api/itemCats/${itemCat._id}`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.name, 'Lamp');
});

test('PATCH /api/itemCats/:id updates itemCat', async () => {
  const project = await Project.create({ name: 'Proj' });
  const category = await Category.create({ categoryName: 'Cat' });
  const itemCat = await ItemCat.create({ name: 'Old', image: 'old.png', projectId: project._id, categoryId: category._id });

  const res = await fetch(`http://localhost:${port}/api/itemCats/${itemCat._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'New' })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.name, 'New');
});

test('DELETE /api/itemCats/:id deletes itemCat', async () => {
  const project = await Project.create({ name: 'Proj' });
  const category = await Category.create({ categoryName: 'Cat' });
  const itemCat = await ItemCat.create({ name: 'DeleteMe', image: 'del.png', projectId: project._id, categoryId: category._id });

  const res = await fetch(`http://localhost:${port}/api/itemCats/${itemCat._id}`, {
    method: 'DELETE'
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.deepEqual(data, { message: 'Catalogue item entry deleted' });

  const exists = await ItemCat.findById(itemCat._id);
  assert.equal(exists, null);
});

test('POST /api/itemCats/:id/confirm creates ItemNew from ItemCat', async () => {
  const project = await Project.create({ name: 'Proj' });
  const category = await Category.create({ categoryName: 'Cat' });
  const itemCat = await ItemCat.create({ name: 'ConfirmMe', image: 'conf.png', projectId: project._id, categoryId: category._id });

  const res = await fetch(`http://localhost:${port}/api/itemCats/${itemCat._id}/confirm`, {
    method: 'POST'
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.name, 'ConfirmMe');

  const itemNew = await ItemNew.findOne({ name: 'ConfirmMe' });
  assert.ok(itemNew);
});
