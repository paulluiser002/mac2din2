# Mac2Din2 House of Curtains

A static Astro showroom with a GPU curtain entrance, a continuous interactive window scene, curated installation photographs, silent films and direct contact.

## Run

Node 24 (`.nvmrc`).

```sh
nvm install
nvm use
npm ci
npm run dev
npm test
npm run build
node scripts/verify-build.mjs
npm run preview
```

Astro 7 manages the development server in the background. Use `npx astro dev stop` to stop it.

## Deployment

Vercel Astro preset, root `./`, install `npm ci`, build `npm run build`, output `dist`, production branch `main`. No environment variables or server adapter required. Media derivatives are committed; `npm run assets` is an optional local preparation step, not a deployment command.

## Content and motion

The logo is the actual business identity. 13 unique photographs and 3 distinct portrait walkthroughs come from the user's Mac2Din2 Mediaset 1 and 2. See `docs/media/README.md` for curation and processing. The old public Instagram photographs are removed. Originals remain untouched in Downloads. `src/data/media.json` drives the two photo galleries, three-three-film gallery and one feature photograph.

A small GPU cloth mesh owns the entrance. The larger React/Three room loads after the opening finishes. One fixed room spans the full page; camera motion follows the entire document, with independent foreground depth. The architectural scene and outdoor garden are illustrative. A smooth camera path moves from room-wide views to close fabric views and warmer light, then back to the room. Skip, direct anchors, reduced motion, Data Saver and WebGL failure preserve readable HTML and direct contact.

Photo carousels loop with inert sentinels, touch swiping, large arrows over the image edges and arrow-key navigation. Films use an independent three-column gallery on desktop and stacked cards on mobile. Films load near view and autoplay muted/inline when visible, with explicit pause/play and offscreen/tab suspension. Visitors with reduced motion or Data Saver start films manually.

## Sources and verification

- `src/pages/index.astro`, `src/components/Gallery.astro`: semantic page and media.
- `src/scripts/`: curtain entrance, looping galleries, video lifecycle.
- `src/components/SceneLoader.tsx`, `Showroom.tsx`, `src/scene/`: deferred window room.
- `public/media/`: compressed web photos, posters, MP4s and illustrative garden.
- `assets/`: original logo and earlier source archive, not all used by the page.

Desktop/mobile browser QA and automated tests cover the supported interactions. Actual low-end phone GPU behavior and completed calls/Instagram messages require real-device verification. The optional Three bundle still triggers a chunk-size advisory and an upstream Three Clock warning.
