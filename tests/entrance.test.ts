import test from "node:test";
import assert from "node:assert/strict";
import { entranceGather } from "../src/scripts/entrance.ts";
test("curtain starts closed, pulls at the header first, and settles fully open", () => {
  assert.equal(entranceGather(0, 0), 0);
  assert.ok(entranceGather(1, 0) > entranceGather(1, 1));
  assert.ok(entranceGather(2.7, 1) > 0.999);
  for (let t = 0; t < 3; t += 0.01)
    for (const v of [0, 0.5, 1])
      assert.ok(Number.isFinite(entranceGather(t, v)));
});
