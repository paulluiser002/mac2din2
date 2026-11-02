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

The entrance starts on smooth champagne folds, then pulls the actual 3D camera back into the first window and brings in the hero copy. The scene warms behind the fabric; slow or disabled WebGL uses the HTML window fallback. Three architectural bays span one continuous room: pleated drapes/sheers, an arched window with linen curtains, and a wide window with wood blinds. Each opens and closes as the camera travels along the page. Cloth gathering uses damped spring dynamics. Reloads reset to the hero and replay the reveal; fresh external section links remain direct. Skip, reduced motion and Data Saver preserve readable HTML and direct contact.

Photo carousels loop with inert sentinels, touch swiping, large arrows over the image edges and arrow-key navigation. Films use an independent three-column gallery on desktop and stacked cards on mobile. Films load near view and autoplay muted/inline when visible, with explicit pause/play and offscreen/tab suspension. Visitors with reduced motion or Data Saver start films manually.

## Sources and verification

- `src/pages/index.astro`, `src/components/Gallery.astro`: semantic page and media.
- `src/scripts/`: curtain entrance, looping galleries, video lifecycle.
- `src/components/SceneLoader.tsx`, `Showroom.tsx`, `src/scene/`: deferred window room.
- `public/media/`: compressed web photos, posters, MP4s and illustrative garden.
- `assets/`: original logo and earlier source archive, not all used by the page.

Desktop/mobile browser QA and automated tests cover the supported interactions. Actual low-end phone GPU behavior and completed calls/Instagram messages require real-device verification. The optional Three bundle still triggers a chunk-size advisory and an upstream Three Clock warning.

Hero fabric controls use neutral fabric relief, so Stone, Champagne and Ivory tint the curtain without a baked-in gold image overriding the chosen color. Swatches and labels share the scene palette.
