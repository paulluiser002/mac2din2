import test from "node:test";
import assert from "node:assert/strict";
import { windowJourney, journeyCamera } from "../src/scene/pose.ts";
import { createClothPull, stepClothPull } from "../src/scripts/cloth.ts";
test("each window opens and closes during its own part of the journey", () => {
  for (let i = 0; i < 3; i++) {
    assert.ok(windowJourney(i / 3).openness[i] <= (i === 0 ? 0.28 : 0.01));
    assert.ok(windowJourney((i + 0.48) / 3).openness[i] > 0.99);
    assert.ok(windowJourney((i + 1) / 3).openness[i] < 0.01);
  }
  assert.equal(
    new Set([0.1, 0.5, 0.9].map((p) => windowJourney(p).index)).size,
    3,
  );
});
test("camera moves between three distinct window bays without a position or target cut", () => {
  assert.ok(journeyCamera(0.1).target[0] < 2);
  assert.ok(Math.abs(journeyCamera(0.5).target[0] - 10.5) < 1);
  assert.ok(journeyCamera(0.9).target[0] > 20);
  for (let p = 0; p < 1; p += 0.001) {
    const a = journeyCamera(p),
      b = journeyCamera(p + 0.00001);
    assert.ok(Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 0.01);
    assert.ok(Math.abs(a.target[0] - b.target[0]) < 0.01);
  }
  for (const p of [NaN, -2, 2])
    assert.ok(
      windowJourney(p).openness.every(
        (n) => Number.isFinite(n) && n >= 0 && n <= 1,
      ),
    );
});
test("cloth pull follows at the rail first, carries weight below and settles without instability", () => {
  const state = createClothPull();
  for (let i = 0; i < 12; i++) stepClothPull(state, 1, 1 / 60);
  assert.ok(state.position[0] > state.position.at(-1)!);
  for (let i = 0; i < 300; i++)
    stepClothPull(state, 1, [1 / 120, 1 / 60, 0.08][i % 3]);
  assert.ok(
    state.position.every((n) => Number.isFinite(n) && n >= 0 && n <= 1.03),
  );
  assert.ok(state.position.every((n) => Math.abs(1 - n) < 0.001));
  for (let i = 0; i < 300; i++) stepClothPull(state, 0, 1 / 60);
  assert.ok(state.position.every((n) => Math.abs(n) < 0.001));
});
