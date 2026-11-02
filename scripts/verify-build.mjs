import assert from "node:assert/strict";
import { readFile, access, stat } from "node:fs/promises";
import { JSDOM } from "jsdom";
const html = await readFile("dist/index.html", "utf8");
const document = new JSDOM(html).window.document;
assert.equal(document.querySelectorAll("h1").length, 1);
for (const href of [
  "tel:+639178361524",
  "tel:+639228169859",
  "https://www.instagram.com/mac2din2houseofcurtain/",
])
  assert.ok(
    document.querySelector(`a[href="${href}"]`),
    `Missing contact route ${href}`,
  );
assert.equal(document.querySelectorAll("[data-carousel]").length, 2);
const photos = [...document.querySelectorAll("main img")];
assert.equal(photos.length, 13);
assert.equal(
  new Set(photos.map((image) => image.getAttribute("src"))).size,
  13,
);
assert.equal(document.querySelectorAll("video").length, 3);
assert.equal(document.querySelectorAll("[data-carousel] video").length, 0);
assert.equal(document.querySelectorAll("[data-film]").length, 3);
assert.equal(document.querySelector("main").hasAttribute("inert"), false);
for (const image of document.querySelectorAll("img")) {
  assert.ok(image.hasAttribute("alt"));
  const paths = [
    image.getAttribute("src"),
    ...(image
      .getAttribute("srcset")
      ?.split(",")
      .map((item) => item.trim().split(/\s+/)[0]) ?? []),
  ];
  for (const path of paths) {
    assert.ok(
      path?.startsWith("/media/") || path?.startsWith("/images/logo."),
      `Old or remote image ${path}`,
    );
    await access(`dist${path}`);
  }
}
for (const video of document.querySelectorAll("video")) {
  assert.ok(video.hasAttribute("muted") && video.hasAttribute("playsinline"));
  assert.equal(video.getAttribute("preload"), "none");
  for (const path of [
    video.getAttribute("data-src"),
    video.getAttribute("poster"),
  ])
    await access(`dist${path}`);
  assert.ok(
    (await stat(`dist${video.getAttribute("data-src")}`)).size < 8_000_000,
  );
}
console.log(
  "Verified static content, 2 photo galleries, 13 unique photos, 3 deferred muted portrait film cards, every local asset and contact route.",
);
