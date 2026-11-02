import test from "node:test";
import assert from "node:assert/strict";
import { introCamera, journeyCamera } from "../src/scene/pose.ts";
test("fabric-to-room camera pulls back from close folds into the exact hero viewpoint", () => {
  const close = introCamera(0, false),
    room = introCamera(1, false),
    hero = journeyCamera(0);
  assert.ok(close.camera[2] < 1);
  assert.deepEqual(room.camera, [hero.x, hero.y, hero.z]);
  assert.ok(
    Math.hypot(
      ...room.target.map((value, index) => value - hero.target[index]),
    ) < 1e-8,
  );
  for (let p = 0; p < 1; p += 0.01) {
    const a = introCamera(p, true),
      b = introCamera(p + 0.01, true);
    assert.ok(b.camera[2] >= a.camera[2]);
    assert.ok(a.camera.every(Number.isFinite));
  }
});
