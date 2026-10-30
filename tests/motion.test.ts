import test from 'node:test';
import assert from 'node:assert/strict';
import { allowsMotion } from '../src/scripts/motion.ts';

test('Data Saver and reduced motion each disable the full cinematic experience', () => {
  assert.equal(allowsMotion(false, true), false);
  assert.equal(allowsMotion(true, false), false);
  assert.equal(allowsMotion(true, true), false);
  assert.equal(allowsMotion(false, false), true);
});
