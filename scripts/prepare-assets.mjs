import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/images', { recursive: true });
const photographs = [
  ['assets/retouched/sheer-room.png', 'sheer-room'],
  ['assets/retouched/layered-room.png', 'layered-room'],
  ['assets/retouched/classic-room.png', 'classic-room'],
  ['assets/retouched/tall-room.png', 'tall-room'],
  ['assets/retouched/blinds-room.png', 'blinds-room'],
  ['assets/retouched/neutral-bedroom.png', 'neutral-bedroom'],
  ['assets/retouched/stairwell-sheers.png', 'stairwell-sheers'],
  ['assets/retouched/tailored-pleats.png', 'tailored-pleats'],
  ['assets/retouched/single-panel.png', 'single-panel'],
  ['assets/retouched/blue-blind.png', 'blue-blind'],
];
for (const [source, name] of photographs) {
  for (const width of [480, 960, 1440]) {
    await sharp(source).resize({ width })
      .webp({ quality: 88 }).toFile(`public/images/${name}-${width}.webp`);
  }
}
await sharp('assets/brand/logo-restored.png')
  .trim({ threshold: 15 })
  .resize({ width: 500 }).webp({ quality: 96 }).toFile('public/images/logo.webp');
await sharp('assets/brand/logo-restored.png')
  .trim({ threshold: 15 }).resize({ width: 1200, withoutEnlargement: true })
  .png().toFile('public/images/logo.png');
await sharp('assets/source/mac2din2-logo-original.jpg')
  .extract({ left: 230, top: 150, width: 640, height: 540 })
  .resize(96, 96, { fit: 'contain', background: '#ffffff' })
  .png().toFile('public/favicon.png');
console.log('Prepared actual logo, favicon, and 30 responsive images from 10 distinct installations. Originals preserved.');
for (const width of [640, 1280]) {
  await sharp('assets/scene/room-poster.png').resize({ width }).webp({ quality: 88 }).toFile(`public/images/room-poster-${width}.webp`);
}
