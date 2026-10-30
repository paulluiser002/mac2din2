import test from 'node:test';
import assert from 'node:assert/strict';
import { projects, detailProjects, approachProject } from '../src/data/projects.ts';

test('every installation image slot uses a distinct photo and a distinct source post', () => {
  const all = [...projects, ...detailProjects, approachProject];
  assert.equal(all.length, 10);
  assert.equal(new Set(all.map(project => project.image)).size, all.length);
  assert.equal(new Set(all.map(project => project.source)).size, all.length);
});
