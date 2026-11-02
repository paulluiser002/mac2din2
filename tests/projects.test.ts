import test from "node:test";
import assert from "node:assert/strict";
import { photographs, films, gallery } from "../src/data/projects.ts";
test("all gallery photographs and films have unique curated sources and consistent ratios", () => {
  const all = [...photographs, ...films];
  assert.equal(photographs.length, 13);
  assert.equal(films.length, 3);
  assert.equal(new Set(all.map((item) => item.source)).size, 16);
  assert.equal(new Set(all.map((item) => item.id)).size, 16);
  for (const group of ["living", "collection", "films"]) {
    const items = gallery(group);
    assert.ok(items.length >= 3);
    assert.equal(
      new Set(items.map((item) => item.width / item.height)).size,
      1,
    );
  }
  assert.ok(all.every((item) => item.source.startsWith("Mediaset ")));
});
