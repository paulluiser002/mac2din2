import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

function load(type: string, hash: string) {
  const page = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  const script = page.match(/<script is:inline id="reload-start">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, 'Reload handling must run inline in the head before the page renders.');
  const scrolls: unknown[] = [];
  const state = { preserved: true };
  const frames: FrameRequestCallback[] = [];
  const dom = new JSDOM(`<head><script>${script}</script></head><body></body>`, {
    url: `https://example.test/?source=curtain%20showroom${hash}`,
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(window) {
      window.requestAnimationFrame = callback => { frames.push(callback); return frames.length; };
      window.performance.getEntriesByType = () => [{ type }] as unknown as PerformanceEntryList;
      window.history.replaceState(state, '');
      window.history.scrollRestoration = 'auto';
      window.scrollTo = (options: unknown) => { scrolls.push(options); };
    },
  });
  return { dom, scrolls, state, frames };
}

test('reload clears a retained section anchor and prevents browser scroll restoration', () => {
  const { dom, scrolls, state } = load('reload', '#films');
  assert.equal(dom.window.location.hash, '');
  assert.equal(dom.window.location.search, '?source=curtain%20showroom');
  assert.deepEqual(dom.window.history.state, state);
  assert.equal(dom.window.history.scrollRestoration, 'manual');
  assert.equal(scrolls.length, 1);
  assert.equal((scrolls[0] as ScrollToOptions).top, 0);
  dom.window.dispatchEvent(new dom.window.Event('pageshow'));
  assert.equal(scrolls.length, 2);
  dom.window.close();
});

test('reload from a plain URL also starts at the hero', () => {
  const { dom, scrolls } = load('reload', '');
  assert.equal(dom.window.history.scrollRestoration, 'manual');
  assert.equal((scrolls[0] as ScrollToOptions).top, 0);
  dom.window.close();
});

test('fresh direct section links and back-forward navigation retain their destination', () => {
  for (const type of ['navigate', 'back_forward']) {
    const { dom, scrolls } = load(type, '#contact');
    assert.equal(dom.window.location.hash, '#contact');
    assert.equal(dom.window.history.scrollRestoration, 'auto');
    assert.equal(scrolls.length, 0);
    dom.window.close();
  }
});

test('a late pageshow never pulls a visitor back after the intro has finished', () => {
  const { dom, scrolls } = load('reload', '#works');
  dom.window.document.documentElement.dataset.unveiled = 'true';
  dom.window.dispatchEvent(new dom.window.Event('pageshow'));
  assert.equal(scrolls.length, 1);
  dom.window.close();
});

test('reload restores normal history scrolling after the initial restoration opportunity', () => {
  const { dom, frames } = load('reload', '#works');
  assert.equal(dom.window.history.scrollRestoration, 'manual');
  dom.window.dispatchEvent(new dom.window.Event('pageshow'));
  assert.equal(dom.window.history.scrollRestoration, 'manual');
  frames.forEach(frame => frame(0));
  assert.equal(dom.window.history.scrollRestoration, 'auto');
  dom.window.close();
});
