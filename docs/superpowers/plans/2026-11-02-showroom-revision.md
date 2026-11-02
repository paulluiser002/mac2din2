# Continuous showroom implementation plan

> Use executing-plans to implement task by task. User requested execution and push to main.

Goal: fluid curtain entrance, a continuous window showroom, logo palette and rich new media galleries.
Architecture: preserve Astro/static HTML and one demand-rendered R3F canvas, add a tiny standalone GPU entrance, reuse native scroll galleries with loop sentinels and IntersectionObserver films.
Spec: docs/superpowers/specs/2026-11-02-showroom-revision-design.md

Global constraints: user source files untouched; all gallery photos unique; uniform ratio per carousel; muted controllable films; motion preference fallback; no unverified business claims.

Review focus: loop wrap during rapid touch/keyboard input; mobile crop retaining curtain; manual pause surviving visibility changes; hero first load/shader work versus entrance; direct anchors and reduced-motion fallbacks.

- [x] Task 1: Media inventory and preparation. Inspect contact sheets and video samples, select distinct photos and clips, encode and record manifest/provenance. Assert unique sources, dimensions, sizes, watermark inspection.
- [x] Task 2: Continuous galleries and films. First update carousel DOM tests for wrapping and keyboard, add playback lifecycle regression tests; run red. Implement loop sentinels and visibility playback controls, run green.
- [x] Task 3: GPU entrance and shared scene. Test deterministic cloth response and camera continuity, run red; implement curtain shader/RAF, deferred scene hydration and detailed window; run green. Persistent scene follows whole document, section foreground depths.
- [x] Task 4: Page/palette integration. Replace old galleries with new manifest, add film gallery and depth chapters; update source/build verifier. Run tests/build and inspect desktop/mobile renders, films and looping. Fresh whole-change review, fix significant findings. Commit and push main, verify remote SHA and deployment if available.

Final scope follows the binding follow-up revisions:13 photos,3 independent portrait film cards, garden-only outlook, changing camera views and large image-edge arrows. Verification:21 tests, Astro check/build and static asset/contact verifier pass; fresh targeted review clear.
