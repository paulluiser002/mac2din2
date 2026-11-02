# Implementation record

Completed the approved local showroom and subsequent user revisions: opening curtain reveal, full-page parallax, watermark removal, consistent photo quality, no repeated images, and full compositions.

## Verification

- 14 behavioral tests pass, including curtain gathering, gallery navigation, opening reveal, delayed script loading, fallback tween cancellation, motion preference policy, and unique photo/source posts.
- Astro type-check: 0 errors, warnings, or hints. Static production build succeeds.
- Generated page checked with scripts disabled: contact links, both galleries, all image references, and 10 unique photograph slots verified.
- Browser checks: short phone and normal phone layouts, tablet/desktop rendering, gallery finite ends, contact/work anchors, selected view/fabric controls, and no horizontal overflow. Production runtime has no logged errors.
- Impeccable detector returned no findings.
- Fresh independent review completed; actionable findings were fixed and verified. No deferred review findings.

## Rulings made during implementation

- Build locally, following the approved roadmap. Hosting is a separate deployment step.
- Use the current Astro stack with Node 24 because the system Node 22.17 is below Astro's engine floor. Developers must select the recorded Node version.
- Reserve height for sticky navigation so mobile controls remain clear. The visible 3D room is slightly shorter on small screens; very short landscape screens use ordinary flow.

## Limits

Real phone GPU performance, live telephone calls and Instagram message delivery were not tested. Upstream Three.js deprecation warnings and the optional 3D chunk-size warning are documented in README.md. Photos are restoration derivatives of actual business-profile photographs; untouched sources remain in assets/source/.

## 2026-11-02 showroom revision

- Replaced the width-animated CSS intro with a standalone GPU cloth mesh, top-led gathering and delayed lower response. Heavy Three loading happens after unveiling. Static garden/window remains visible until the first completed room frame. Skip, timeout and motion-policy fallbacks remain.
- Detailed window frame, mullions, handles, glazing and sill; generated tropical garden backdrop has no house. Garden source is committed and the asset pipeline uses it.
- One persistent room throughout the document, with authored wide/close fabric/window/return views, smooth camera and look-target interpolation, and warm light changes. Independent foreground depth; softly blended section surfaces, no scene reset.
- Logo-derived warm white, charcoal, gold and champagne palette. Node24.x pinned to match tested/Vercel runtime.
- Reviewed all57 supplied media. Final13 photographs and3 portrait films after user's stronger deduplication request. Previous public installation imagery removed. Uniform crops per photo carousel; no watermarks found in chosen material. Original sources untouched.
- Photo galleries loop by native scroll, large60px/56px image-edge arrows, counts, touch and keyboard. Rapid button presses accumulate destinations. Inert photo sentinels stay outside keyboard access.
- Films use independent staggered cards/stacked mobile layout, not a carousel. Visible-only muted inline autoplay with clear in-frame Pause/Play. Explicit pause persists across visibility and motion preference updates. Portrait request supersedes the temporary landscape request which the user revoked.
- Verification:21 tests pass; Astro check/build pass; generated no-JS content, all source assets and contact links verified. Design detector returned[]. Browser QA at320×568,390×844 and1440×900: no horizontal overflow, gallery wrap both directions, rapid3-click navigation, correctly decoded MP4 autoplay when visible and manual pause. Short phones use an ordinary scrolling hero so room controls remain reachable; duplicate floating CTA hides during hero. No production browser error logs observed.
- Fresh whole-change review found3 interaction issues; all addressed with red-green tests or the user's replacement film layout. Targeted review found no unresolved critical/important issues. Physical low-end phone GPU timing and completed calls/messages are not measured. Upstream Three Clock deprecation and optional scene chunk-size advisory remain nonfatal.

## 2026-11-02 fabric-to-room and three-window update

- Reload handling runs inline before rendering, clears retained section hashes while preserving URL query/history state, suppresses the initial browser scroll restoration, then restores normal history behavior. Fresh direct links remain direct.
- Final user-selected entrance supersedes earlier split curtain styles: smooth fabric close-up dissolves into the actual 3D cloth, camera pulls back over2.2seconds to the exact hero pose, daylight enters and hero text appears. Scene readiness gates the handoff;1400ms warmup triggers a bounded fallback; late JavaScript preserves the running CSS reveal. Skip/motion preferences remain.
- Three architectural bays in one continuous room: rectangular pleated drapes/sheers, arched linen curtains, wide wood blinds. Camera travels between them with smooth position/target interpolation. Each opens/closes through its own scroll phase; linen and drapes use a stable eight-point damped spring chain, blinds tilt and partially lift.
- Added an unobstructed blinds chapter so the third treatment remains visible between gallery surfaces.
- Corrected hero color rendering: texture now supplies relief only, with distinctly separate Stone/Champagne/Ivory tints; material colors, swatches and labels align. Visually checked all three in the actual WebGL render.
- Thirty-two tests pass, including reload/history lifecycle, window phases, camera/intro continuity, spring stability, ready/slow/late reveal paths. Fresh reviewer found no significant remaining issues in the final intro lifecycle. Browser checks verify a scene-backed handoff, reachable hero and contact, arched bay, color changes, and no runtime errors. Real-device GPU timing is not measured.
