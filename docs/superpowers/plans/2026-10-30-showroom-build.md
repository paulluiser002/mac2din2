# Immersive Showroom Implementation Plan

> **For agentic workers:** Use executing-plans to implement this plan task-by-task. User authorized execution of the approved design; no further design approval is needed.

**Goal:** Build the approved local promotional website with real assets, real 3D curtain motion, accessible carousels, and direct contact.

**Architecture:** Static Astro content and local responsive images. One React Three Fiber scene progressively enhances a poster, coordinated by GSAP; native horizontal scroll galleries remain usable without JavaScript.

**Tech Stack:** Astro, React, Three.js / React Three Fiber, GSAP, TypeScript, CSS; Node 24.

**Spec:** `docs/superpowers/specs/2026-10-30-immersive-showroom-design.md`.

## Global Constraints

- Preserve the actual logo, factual business content, and source assets.
- Use direct telephone and public Instagram links; no form or backend.
- Real project photographs only in the portfolio; virtual room labeled illustrative.
- One active WebGL canvas; no scroll hijacking, autoplay carousel, or automatic sound.
- Reduced-motion, no-JavaScript, and WebGL-failure paths preserve content/contact.
- Local implementation and preview; deployment is outside this approved roadmap.

## Review Focus

- WebGL unavailable or context lost: readable poster and complete page, no excessive sticky spacing.
- Reduced motion or Data Saver: no cinematic movement; content remains complete.
- Narrow phone / orientation change: no overflow or overlapping primary controls.
- Carousel at either end and vertical touch scroll: stable, honest state, accessible controls.
- Fast/reverse scrolling and direct anchors: contacts remain reachable and 3D returns to the right pose.

### Task 1: Page and assets

Files: `src/pages/index.astro`, `src/styles/global.css`, `src/components/Icon.astro`, `src/data/projects.ts`, `scripts/prepare-assets.mjs`, `public/images/`, `README.md`.

Interfaces: static contact anchors `#contact`, gallery `#works`, showroom `#showroom` / `#curtains`; image records contain `src`, `srcset`, `alt`, `title`, `type`, `source`.

- [x] Prepare actual logo and responsive local images; preserve originals.
- [x] Build complete static page with semantic headings, working anchors/contact links, project galleries, and static showroom fallback.
- [x] Run asset script and Astro check/build; inspect initial desktop/mobile render.
- [x] Commit the page and assets.

### Task 2: 3D scene and progressive motion

Files: `src/components/Showroom.tsx`, `src/scene/Room.tsx`, `src/scene/curtain.ts`, `src/scene/pose.ts`, `tests/scene.test.ts`.

Interfaces: `getScenePose(progress, mode)` yields finite open/camera/light state; `sampleCurtain(u, v, openness, side)` defines physical drape geometry; `Showroom` enhances the scene host and shared static controls via DOM IDs.

- [x] Write scene tests proving gathering clears the center, curtain vertices/normals stay finite, progress clamps, and selected view changes the rendered curtain state. Run and observe the missing-module failure.
- [x] Implement geometry and pose functions; run unit tests to green.
- [x] Build the room, lighting, drapes, furniture, shared canvas, scroll coupling, material controls, and offscreen rendering pause.
- [x] Provide conservative loading/reduced-motion/WebGL-error fallbacks and test behavior in the browser.
- [x] Run tests and production build; commit.

### Task 3: Galleries and delivery

Files: `src/scripts/carousel.ts`, `tests/carousel.test.ts`, `README.md`, existing page/styles as needed.

Interface: `initCarousel(root)` binds the gallery's track, controls, count and pagination, returning disposal for page lifecycle cleanup.

- [x] Write real-DOM tests for next/previous movement, first/last disabled state, empty/single-item behavior, and manual scroll count. Observe failure before implementation.
- [x] Implement accessible gallery controls and viewport-relative slide selection; keep native scroll as baseline.
- [x] Browser-check phone/desktop, reduced motion, no-JS, WebGL failure, anchors, material controls, and image delivery; resolve observed issues.
- [x] Run full suite, Astro check/build, design detector, and a fresh whole-change review. Fix material findings and verify.
- [x] Commit, leave local preview available, and report the result and any material limits.
