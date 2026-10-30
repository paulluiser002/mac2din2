# Mac2Din2 House of Curtains

A local, static promotional website with a curtain-opening intro, an interactive 3D room, scroll parallax, real installation carousels, and direct telephone / Instagram contact.

## Run

Use Node **24** (`.nvmrc`; Astro requires at least 22.23.4).

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open the Local URL printed by Astro, normally http://127.0.0.1:4321.

```sh
npm test        # scene, gallery, and intro behavior
npm run build  # type-check and generate the static dist/ site
npm run preview
npm run assets # regenerate local web images from retained sources
```

Astro 7 manages its dev server in the background. Use `npx astro dev stop` to stop it.

## Contents

- `src/pages/index.astro`: complete semantic page, contacts, carousels and intro.
- `src/components/Showroom.tsx`: progressive WebGL enhancement, scroll timeline and view/fabric controls.
- `src/scene/`: procedural room, pleated curtain geometry, and tested camera/view state.
- `src/scripts/`: native gallery controls and skippable intro behavior.
- `assets/source/`: untouched business assets and source links.
- `assets/brand/`, `assets/retouched/`: restored actual logo and authorized watermark cleanup.
- `assets/scene/room-poster.png`: poster captured from the actual 3D scene.
- `public/images/`: optimized, responsive website assets.

## Behavior and scope

The intro opens automatically and can be skipped. Direct section links bypass it. Reduced motion bypasses the intro, parallax and WebGL; the static scene poster and all project/contact content remain. WebGL errors or context loss also restore the poster. No external imagery, fonts, live Instagram embeds, or paid models are required at runtime.

Contact uses only the business's published telephone numbers and Instagram profile. There is no contact form, backend, online checkout, analytics integration or deployment configuration. Calling or messaging is completed by the visitor in the selected channel.

The ten distinct installation images are from ten business-profile posts. Each image slot uses a different photograph. All received conservative clarity and exposure restoration; watermark overlays were removed where present. Reconstructed pixels are retouched content, and source originals remain available for comparison. Images keep their full composition with contain sizing; parallax moves their frames rather than zooming/cropping the photos. Virtual room views and fabric colors are illustrative.

## Verification limits

Desktop and mobile browser layouts are checked locally; actual phone hardware performance and live calls/messages are not verified. React Three Fiber currently emits upstream Three.js deprecation warnings, and the build reports the size of the optional 3D chunk. Neither is a build error. Hosting and a custom domain remain a separate step.
