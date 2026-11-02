import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { initFilm } from "../src/scripts/films.ts";
test("films play only when visible and preserve explicit pause through scrolling", async () => {
  const dom = new JSDOM(
    '<figure><video data-src="/film.mp4"></video><button data-play>Play film</button></figure>',
    { pretendToBeVisual: true },
  );
  const root = dom.window.document.querySelector("figure")!,
    video = root.querySelector("video")!,
    button = root.querySelector("button")!;
  let paused = true,
    callback: any;
  Object.defineProperty(video, "paused", { get: () => paused });
  video.load = () => {};
  video.play = async () => {
    paused = false;
    video.dispatchEvent(new dom.window.Event("play"));
  };
  video.pause = () => {
    paused = true;
    video.dispatchEvent(new dom.window.Event("pause"));
  };
  (dom.window as any).IntersectionObserver = class {
    constructor(cb: any) {
      callback = cb;
    }
    observe() {}
    disconnect() {}
  };
  const dispose = initFilm(root as HTMLElement, true);
  callback([{ isIntersecting: true, intersectionRatio: 0.8 }]);
  await Promise.resolve();
  assert.equal(video.getAttribute("src"), "/film.mp4");
  assert.equal(paused, false);
  button.click();
  assert.equal(paused, true);
  callback([{ isIntersecting: false, intersectionRatio: 0 }]);
  callback([{ isIntersecting: true, intersectionRatio: 1 }]);
  assert.equal(paused, true);
  button.click();
  await Promise.resolve();
  assert.equal(paused, false);
  callback([{ isIntersecting: false, intersectionRatio: 0 }]);
  assert.equal(paused, true);
  dispose();
});
test("reduced motion and Data Saver films wait for explicit play", async () => {
  const dom = new JSDOM(
    '<figure><video data-src="/film.mp4"></video><button data-play>Play film</button></figure>',
    { pretendToBeVisual: true },
  );
  let callback: any,
    calls = 0;
  const root = dom.window.document.querySelector<HTMLElement>("figure")!,
    video = root.querySelector("video")!;
  video.load = () => {};
  video.pause = () => {};
  video.play = async () => {
    calls++;
  };
  (dom.window as any).IntersectionObserver = class {
    constructor(cb: any) {
      callback = cb;
    }
    observe() {}
    disconnect() {}
  };
  const dispose = initFilm(root, false);
  callback([{ isIntersecting: true, intersectionRatio: 1 }]);
  assert.equal(calls, 0);
  root.querySelector("button")!.click();
  assert.equal(calls, 1);
  dispose();
});

test("changing autoplay policy preserves an explicit pause decision", async () => {
  const dom = new JSDOM(
    '<figure><video data-src="/film.mp4"></video><button data-play>Play film</button></figure>',
    { pretendToBeVisual: true },
  );
  const root = dom.window.document.querySelector<HTMLElement>("figure")!,
    video = root.querySelector("video")!;
  let paused = true,
    callback: any;
  Object.defineProperty(video, "paused", { get: () => paused });
  video.load = () => {};
  video.play = async () => {
    paused = false;
    video.dispatchEvent(new dom.window.Event("play"));
  };
  video.pause = () => {
    paused = true;
    video.dispatchEvent(new dom.window.Event("pause"));
  };
  (dom.window as any).IntersectionObserver = class {
    constructor(cb: any) {
      callback = cb;
    }
    observe() {}
    disconnect() {}
  };
  const controller = initFilm(root, true);
  callback([{ isIntersecting: true, intersectionRatio: 1 }]);
  await Promise.resolve();
  root.querySelector("button")!.click();
  assert.equal(paused, true);
  controller.setAutoplay(false);
  controller.setAutoplay(true);
  callback([{ isIntersecting: true, intersectionRatio: 1 }]);
  assert.equal(paused, true);
  controller();
});
