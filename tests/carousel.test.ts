import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { initCarousel } from '../src/scripts/carousel.ts';

function fixture(count = 3) {
  const dom = new JSDOM(`<section><div data-track>${'<article data-slide></article>'.repeat(count)}</div><button data-prev></button><button data-next></button><span data-count></span></section>`);
  const root = dom.window.document.querySelector('section')!;
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  Object.defineProperty(track, 'clientWidth', { value: 400 });
  root.querySelectorAll<HTMLElement>('[data-slide]').forEach((slide, index) => {
    Object.defineProperty(slide, 'offsetLeft', { value: index * 420 });
  });
  track.scrollTo = (options?: ScrollToOptions | number) => {
    track.scrollLeft = typeof options === 'number' ? options : options?.left ?? 0;
    track.dispatchEvent(new dom.window.Event('scroll'));
  };
  return { dom, root, track };
}

test('next and previous move through real slides and disable controls at the finite ends', () => {
  const { root, track } = fixture();
  const dispose = initCarousel(root);
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  assert.equal(prev.disabled, true);
  next.click();
  assert.equal(track.scrollLeft, 420);
  next.click();
  assert.equal(track.scrollLeft, 840);
  assert.equal(next.disabled, true);
  assert.match(root.querySelector('[data-count]')!.textContent!, /3.*3/);
  prev.click();
  assert.equal(track.scrollLeft, 420);
  assert.equal(next.disabled, false);
  dispose();
});

test('manual swiping updates the current slide without an extra next-button click', () => {
  const { root, track, dom } = fixture();
  const dispose = initCarousel(root);
  track.scrollLeft = 840;
  track.dispatchEvent(new dom.window.Event('scroll'));
  assert.equal(root.querySelector<HTMLButtonElement>('[data-next]')!.disabled, true);
  assert.match(root.querySelector('[data-count]')!.textContent!, /3.*3/);
  dispose();
});

test('empty and single-image galleries do not offer navigation to missing slides', () => {
  for (const count of [0, 1]) {
    const { root } = fixture(count);
    const dispose = initCarousel(root);
    assert.equal(root.querySelector<HTMLButtonElement>('[data-next]')!.disabled, true);
    assert.equal(root.querySelector<HTMLButtonElement>('[data-prev]')!.disabled, true);
    dispose();
  }
});
