import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import app from '../server.js';
import dotenv from 'dotenv';


test('POST /api/projects creates a new project', async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const server = http.createServer(app);
  const port = 3002;

  await new Promise((resolve) => server.listen(port, resolve));

 const newProject = {
  name: "testing for scrum 41",
  itemCount: 0,
  categoryCount: 0,
  lastUpdated: new Date().toISOString(),
  status: "open"
};

  const res = await fetch(`http://localhost:${port}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProject)
  });

  assert.equal(res.status, 201);

  const data = await res.json();
  assert.equal(data.name, newProject.name);
  assert.equal(data.status, "open");

  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
});


