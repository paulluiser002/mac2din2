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
