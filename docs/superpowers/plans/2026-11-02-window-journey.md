# Window journey implementation plan

Spec: docs/superpowers/specs/2026-11-02-window-journey-design.md (final fabric-to-room override).
Architecture: one Three canvas, three architectural bays, continuous camera/target paths, spring-driven cloth and instanced wood blinds. A matching fabric close-up hands off to the actual camera pulling back into the hero; scene readiness and bounded fallback preserve performance.

- [x] Add regression tests for reload/history, window selection and open/close phases, continuous camera/intro poses, stable spring response and reveal readiness/fallback.
- [x] Implement rectangular drapes/sheers, arched linen curtains and wide wood blinds in one room; retain gallery and contact flows.
- [x] Implement the selected fabric-to-room entrance, smooth animated material style, spring gathering and skip/no-JS/reduced-motion fallbacks.
- [x] Verify desktop/mobile, complete focused fresh review, commit/push main and verify deployment.

Verification:32 tests pass, Astro check/build pass, generated HTML/assets/contact verifier pass. Browser checked room-backed fabric handoff, reload hero reset, arched window and wide blinds, three distinct hero color selections, and clean runtime error logs. Focused review clear.
