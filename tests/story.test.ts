import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

test('scene fallback stops an active text fade before restoring headline and contact access', async () => {
  const dom = new JSDOM('<div id="intro">Headline <a href="#contact">Contact</a></div><div id="story">Story</div>', { pretendToBeVisual: true });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, getComputedStyle: dom.window.getComputedStyle.bind(dom.window) });
  const { gsap } = await import('gsap');
  const { resetStoryText } = await import('../src/scene/story.ts');
  const intro = dom.window.document.querySelector<HTMLElement>('#intro')!;
  const story = dom.window.document.querySelector<HTMLElement>('#story')!;
  gsap.to(intro, { opacity: 0, y: -20, duration: 0.08 }).progress(0.25);
  resetStoryText(intro, story);
  await new Promise(resolve => setTimeout(resolve, 130));
  assert.equal(intro.style.opacity, '');
  assert.equal(intro.style.transform, '');
  assert.equal(intro.inert, false);
  assert.equal(story.getAttribute('aria-hidden'), 'true');
  gsap.ticker.sleep();
  dom.window.close();
});
