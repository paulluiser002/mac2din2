import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { initOpening } from '../src/scripts/opening.ts';

function fixture() {
  const dom = new JSDOM('<div id="opening"><span></span><button>Skip intro</button></div><main><a href="#contact">Contact</a></main>');
  return { dom, opening: dom.window.document.querySelector<HTMLElement>('#opening')!, main: dom.window.document.querySelector<HTMLElement>('main')! };
}

test('skip immediately unveils the page and restores keyboard access', () => {
  const { opening, main } = fixture();
  const finish = initOpening(opening, [main], false);
  assert.equal(main.inert, true);
  opening.querySelector('button')!.click();
  assert.equal(opening.hidden, true);
  assert.equal(main.inert, false);
  finish();
});

test('child fold animations do not prematurely complete the curtain reveal', () => {
  const { opening, main, dom } = fixture();
  const finish = initOpening(opening, [main], false);
  opening.querySelector('span')!.dispatchEvent(new dom.window.Event('animationend', { bubbles: true }));
  assert.equal(opening.hidden, false);
  opening.dispatchEvent(new dom.window.Event('animationend'));
  assert.equal(opening.hidden, true);
  assert.equal(main.inert, false);
  finish();
});

test('reduced motion or direct contact anchors bypass the intro entirely', () => {
  const { opening, main } = fixture();
  initOpening(opening, [main], true);
  assert.equal(opening.hidden, true);
  assert.notEqual(main.inert, true);
});
