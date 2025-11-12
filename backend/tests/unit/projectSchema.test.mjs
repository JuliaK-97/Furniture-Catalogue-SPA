import { test } from "node:test";
import assert from "node:assert/strict";
import Project from "../../models/Project.js";

test("Project schema requires name", async () => {
  const project = new Project({ status: "open" });
  let error;
  try {
    await project.validate();
  } catch (err) {
    error = err;
  }
  assert.ok(error, "Expected validation error for missing name");
  assert.equal(error.errors.name.kind, "required");
});
test("Project schema rejects invalid status", async () => {
  const project = new Project({
    name: "Invalid Status Project",
    status: "archived" // not allowed by enum
  });

  let error;
  try {
    await project.validate();
  } catch (err) {
    error = err;
  }
  assert.ok(error, "Expected validation error for invalid status");
  assert.equal(error.errors.status.kind, "enum");
});
test("default item count is 0", async () => {
  const project = new Project({ name: "Default ItemCount" });
  assert.equal(project.itemCount, 0);
});

test("Default category count is 0", async () => {
  const project = new Project({ name: "Default CategoryCount" });
  assert.equal(project.categoryCount, 0);
});

test("lastUpdated is set to current date", async () => {
  const project = new Project({ name: "Default LastUpdated Project" });

  const now = new Date();
  const diff = Math.abs(now.getTime() - project.lastUpdated.getTime());

  assert.ok(diff < 2000, "lastUpdated should default to current time");
});

