import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { initOpening } from "../src/scripts/opening.ts";

function fixture() {
  const dom = new JSDOM(
    '<div id="opening"><span></span><button>Skip intro</button></div><main><a href="#contact">Contact</a></main>',
  );
  return {
    dom,
    opening: dom.window.document.querySelector<HTMLElement>("#opening")!,
    main: dom.window.document.querySelector<HTMLElement>("main")!,
  };
}

test("skip immediately unveils the page and restores keyboard access", () => {
  const { opening, main } = fixture();
  const finish = initOpening(opening, [main], false);
  assert.equal(main.inert, true);
  opening.querySelector("button")!.click();
  assert.equal(opening.hidden, true);
  assert.equal(main.inert, false);
  finish();
});

test("child fold animations do not prematurely complete the curtain reveal", () => {
  const { opening, main, dom } = fixture();
  const finish = initOpening(opening, [main], false);
  opening
    .querySelector("span")!
    .dispatchEvent(new dom.window.Event("animationend", { bubbles: true }));
  assert.equal(opening.hidden, false);
  opening.dispatchEvent(new dom.window.Event("animationend"));
  assert.equal(opening.hidden, true);
  assert.equal(main.inert, false);
  finish();
});

test("reduced motion or direct contact anchors bypass the intro entirely", () => {
  const { opening, main } = fixture();
  initOpening(opening, [main], true);
  assert.equal(opening.hidden, true);
  assert.notEqual(main.inert, true);
});

test("late script loading never locks a page whose CSS curtain intro already finished", () => {
  const { opening, main } = fixture();
  opening.style.visibility = "hidden";
  const finish = initOpening(opening, [main], false);
  const wasLocked = main.inert;
  finish();
  assert.equal(wasLocked, false);
});

test("room readiness starts the handoff and releases the hero after the camera pulls back", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { opening, main, dom } = fixture();
  const finish = initOpening(opening, [main], false);
  assert.equal(
    dom.window.document.documentElement.classList.contains("intro-controlled"),
    true,
  );
  dom.window.document.dispatchEvent(new dom.window.Event("showroom:ready"));
  assert.equal(opening.dataset.revealSource, "room");
  assert.equal(opening.classList.contains("revealing"), true);
  assert.equal(main.inert, true);
  t.mock.timers.tick(2250);
  assert.equal(opening.hidden, true);
  assert.equal(main.inert, false);
  finish();
  dom.window.close();
});
test("a slow room falls back once and never restarts when WebGL arrives later", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const { opening, main, dom } = fixture();
  const finish = initOpening(opening, [main], false);
  t.mock.timers.tick(1400);
  assert.equal(opening.dataset.revealSource, "fallback");
  dom.window.document.dispatchEvent(new dom.window.Event("showroom:ready"));
  assert.equal(opening.dataset.revealSource, "fallback");
  t.mock.timers.tick(2250);
  assert.equal(opening.hidden, true);
  assert.equal(main.inert, false);
  finish();
  dom.window.close();
});
test("late modules preserve a partially progressed CSS reveal", () => {
  const { opening, main, dom } = fixture();
  opening.getAnimations = () => [{ currentTime: 1500 }] as Animation[];
  const finish = initOpening(opening, [main], false);
  assert.equal(
    dom.window.document.documentElement.classList.contains("intro-controlled"),
    false,
  );
  dom.window.document.dispatchEvent(new dom.window.Event("showroom:ready"));
  assert.equal(opening.classList.contains("revealing"), false);
  finish();
  dom.window.close();
});
