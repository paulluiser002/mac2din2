import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { initCarousel } from "../src/scripts/carousel.ts";
function fixture(count = 3) {
  const dom = new JSDOM(
    `<section><div data-track tabindex="0">${"<article data-slide><button>Play</button></article>".repeat(count)}</div><button data-prev></button><button data-next></button><span data-count></span></section>`,
  );
  const root = dom.window.document.querySelector("section")!,
    track = root.querySelector<HTMLElement>("[data-track]")!;
  Object.defineProperty(dom.window.HTMLElement.prototype, "offsetLeft", {
    get() {
      return [...this.parentElement.children].indexOf(this) * 420;
    },
  });
  Object.defineProperty(track, "clientWidth", { value: 400 });
  track.scrollTo = (options?: ScrollToOptions | number) => {
    track.scrollLeft =
      typeof options === "number" ? options : (options?.left ?? 0);
    track.dispatchEvent(new dom.window.Event("scroll"));
  };
  return { dom, root, track };
}
test("next and previous wrap continuously and clones stay out of keyboard access", () => {
  const { root, track, dom } = fixture();
  const dispose = initCarousel(root);
  const prev = root.querySelector<HTMLButtonElement>("[data-prev]")!,
    next = root.querySelector<HTMLButtonElement>("[data-next]")!;
  assert.equal(prev.disabled, false);
  prev.click();
  assert.match(root.querySelector("[data-count]")!.textContent!, /3 \/ 3/);
  track.dispatchEvent(new dom.window.Event("scrollend"));
  next.click();
  assert.match(root.querySelector("[data-count]")!.textContent!, /1 \/ 3/);
  track.dispatchEvent(new dom.window.Event("scrollend"));
  assert.equal(next.disabled, false);
  const clones = [...root.querySelectorAll<HTMLElement>("[data-clone]")];
  assert.ok(clones.length >= 2);
  assert.ok(
    clones.every(
      (clone) => clone.inert && clone.getAttribute("aria-hidden") === "true",
    ),
  );
  dispose();
  assert.equal(root.querySelectorAll("[data-clone]").length, 0);
});
test("manual swipe and keyboard navigation update the real slide count", () => {
  const { root, track, dom } = fixture();
  const dispose = initCarousel(root);
  const originals = [
    ...root.querySelectorAll<HTMLElement>("[data-slide]:not([data-clone])"),
  ];
  track.scrollLeft = originals[2].offsetLeft;
  track.dispatchEvent(new dom.window.Event("scroll"));
  assert.match(root.querySelector("[data-count]")!.textContent!, /3 \/ 3/);
  track.dispatchEvent(
    new dom.window.KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
    }),
  );
  assert.match(root.querySelector("[data-count]")!.textContent!, /1 \/ 3/);
  dispose();
});
test("empty and single-image galleries do not offer navigation", () => {
  for (const count of [0, 1]) {
    const { root } = fixture(count);
    const dispose = initCarousel(root);
    assert.equal(
      root.querySelector<HTMLButtonElement>("[data-next]")!.disabled,
      true,
    );
    assert.equal(
      root.querySelector<HTMLButtonElement>("[data-prev]")!.disabled,
      true,
    );
    dispose();
  }
});

test("rapid next presses accumulate destinations before smooth scrolling advances", () => {
  const { root, track, dom } = fixture(5);
  let destination = 0;
  track.scrollTo = (options?: ScrollToOptions | number) => {
    destination = typeof options === "number" ? options : (options?.left ?? 0);
  };
  const dispose = initCarousel(root);
  track.scrollLeft = destination;
  const next = root.querySelector<HTMLButtonElement>("[data-next]")!;
  next.click();
  next.click();
  next.click();
  assert.match(root.querySelector("[data-count]")!.textContent!, /4 \/ 5/);
  track.scrollLeft = destination;
  track.dispatchEvent(new dom.window.Event("scroll"));
  track.dispatchEvent(new dom.window.Event("scrollend"));
  assert.match(root.querySelector("[data-count]")!.textContent!, /4 \/ 5/);
  dispose();
});
