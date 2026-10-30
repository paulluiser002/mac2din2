import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

// JSDOM leaves scripts disabled: this checks the actual generated no-JavaScript page.
const html = await readFile('dist/index.html', 'utf8');
const document = new JSDOM(html).window.document;
assert.equal(document.querySelectorAll('h1').length, 1);
for (const href of ['tel:+639178361524', 'tel:+639228169859', 'https://www.instagram.com/mac2din2houseofcurtain/']) {
  assert.ok(document.querySelector(`a[href="${href}"]`), `Missing contact route: ${href}`);
}
assert.equal(document.querySelectorAll('#works [data-slide]').length, 5);
assert.equal(document.querySelectorAll('.detail-section [data-slide]').length, 4);
assert.equal(document.querySelector('main').hasAttribute('inert'), false);
for (const image of document.querySelectorAll('img')) {
  assert.ok(image.hasAttribute('alt'), 'Every image needs alt text or explicit decorative alt.');
  const paths = [image.getAttribute('src'), ...image.getAttribute('srcset')?.split(',').map(item => item.trim().split(/\s+/)[0]) ?? []];
  for (const path of paths) {
    assert.ok(path?.startsWith('/images/'), `Unexpected remote image: ${path}`);
    await access(`dist${path}`);
  }
}
console.log('Verified generated no-JS content, all direct contact routes, both galleries, and every referenced image.');
