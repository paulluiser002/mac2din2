import test from 'node:test';
import assert from 'node:assert/strict';
import { getScenePose } from '../src/scene/pose.ts';
import { sampleCurtain, createCurtainGeometry } from '../src/scene/curtain.ts';

test('opening gathers both drapes away from the window center while keeping their outer edges fixed', () => {
  const leftClosed = sampleCurtain(1, 0.5, 0, -1);
  const leftOpen = sampleCurtain(1, 0.5, 1, -1);
  const rightOpen = sampleCurtain(1, 0.5, 1, 1);
  assert.ok(leftClosed.x > -0.2);
  assert.ok(leftOpen.x < -2);
  assert.ok(rightOpen.x > 2);
  assert.equal(sampleCurtain(0, 0, 0, -1).x, sampleCurtain(0, 0, 1, -1).x);
});

test('curtain geometry has finite positions and normals in closed, half-open, and open states', () => {
  for (const open of [0, 0.5, 1]) {
    const geometry = createCurtainGeometry(open, -1);
    for (const name of ['position', 'normal']) {
      assert.ok(Array.from(geometry.getAttribute(name).array).every(Number.isFinite));
    }
    assert.ok(geometry.index && geometry.index.count > 0);
    geometry.dispose();
  }
});

test('scroll poses remain finite at the limits, invalid input, and reverse scroll', () => {
  for (const progress of [-10, 0, 0.5, 1, 10, Number.NaN]) {
    const pose = getScenePose(progress, 'scroll');
    assert.ok(pose.openness >= 0 && pose.openness <= 1);
    assert.ok(pose.camera.every(Number.isFinite));
    assert.ok(pose.light >= 0);
  }
  assert.deepEqual(getScenePose(-10, 'scroll'), getScenePose(0, 'scroll'));
  assert.deepEqual(getScenePose(10, 'scroll'), getScenePose(1, 'scroll'));
});

test('visitor-selected modes override scroll and restore the scroll pose when released', () => {
  assert.equal(getScenePose(1, 'closed').openness, 0);
  assert.equal(getScenePose(0, 'sheer').openness, 1);
  assert.equal(getScenePose(0.5, 'layered').openness, 0.68);
  assert.notEqual(getScenePose(1, 'scroll').openness, getScenePose(1, 'closed').openness);
});
