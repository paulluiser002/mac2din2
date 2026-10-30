# Mac2Din2 immersive curtain showroom — design brief

Date: 2026-10-30, Asia/Manila. Status: proposed design and build roadmap; no production website implemented.

## Intent

Make visitors feel the difference curtains bring to a room, show that Mac2Din2 has actual installation work behind the presentation, and make it easy to initiate contact. The central idea is **a room revealed through fabric and daylight**.

Confirmed requirements: an immersive curtain showroom, substantial 3D, scroll animation and parallax, actual logo enhanced for website use, project carousels, and contact as the main action. The user delegated all remaining decisions. Audience, styling, copy, stack, performance budgets, and scope below are designer recommendations rather than user-supplied facts.

Planning audience: a homeowner browsing on a phone, followed by designers evaluating the portfolio. First release is one promotional page, not a shop, quotation engine, booking system, CMS, or customer account service.

## Evidence and truth

Use `PRODUCT.md` for business facts and `assets/source/README.md` for asset provenance. Five real installation images and the actual 1080-pixel logo are already saved locally. The logo wording is “Mac2Din2 House of Curtains.” Public contact numbers are 0917 836 1524 and 0922 816 9859.

Every carousel image must be a verified business installation. The virtual showroom is an illustrative 3D environment, labeled “Illustrative room” beside the scene description. It must not be captioned as a completed client project. Product colors and light demonstrations are illustrative, not calibrated specifications or claims of a measured blackout percentage.

Do not invent testimonials, celebrity endorsements, customer names, years of operation, service regions, pricing, free consultations, business hours, lead times, motorization, or warranties. Omit unavailable claims; their absence does not block this page.

## Visual direction

A bright residential showroom with architectural framing, generous room photography, and controlled gold accents. The scene should feel inhabitable and tactile. Fabric is the main visual material; interface chrome stays quiet.

Suggested tokens, to be checked against the actual logo and rendered contrast:

| Token | Value | Role |
| --- | --- | --- |
| Gallery white | #FAFAF7 | Main page and logo surround |
| Daylight | #E8E6DF | Room background and quieter sections |
| Roof charcoal | #252724 | Primary text and dark controls |
| Antique gold | #A57C32 | Small accents and selected details |
| Woven taupe | #8D8172 | Fabric and secondary scene material |
| Deep olive | #414B40 | Secondary fabric scene option |

Do not use the gold token for small body text on white. Use charcoal text for legibility. Gold supports the existing identity rather than turning the whole page into a metallic theme.

Typography recommendation: Bodoni Moda for short editorial headlines and Manrope for text, navigation, and controls; self-host the necessary weights only. Headline scale approximately 40–88px depending on viewport, body 16–18px, navigation 14–16px. Use sentence case, short copy, and mostly left alignment. Body copy stays under about 65 characters per line.

Use large compositions rather than equal-size card grids. On wide screens, the room occupies roughly two-thirds of the hero; text occupies a reserved quiet area without covering important fabric detail. On phones, keep text and the contact action legible above or beside a portrait-friendly room composition.

## Logo treatment

Preserve `assets/source/mac2din2-logo-original.jpg` untouched. The higher-resolution source is already a major improvement over the small Instagram thumbnail. Its 1080-pixel resolution is sufficient for a compact header logo at high pixel density.

Prepare a tightly framed, locally served web derivative from that actual source, preserving the roof, MD monogram, gold finish, exact lettering, and aspect ratio. Retain its white background on a matching header surface if removing it damages shadows or lettering. Produce lossless PNG and efficient WebP variants, with intrinsic dimensions and a descriptive alt value. Size the complete mark to remain readable; a compact mobile lockup may pair the original mark with accessible text rather than shrinking the full lettering below recognition.

Use a source-faithful cleanup process; do not regenerate or reinterpret brand lettering. Do not call a raster upscale a vector master. If a true larger master becomes available later, replace the derivative from that source. Logo derivative preparation is a build task, not work already completed in this brief.

## Page sequence

| Section | What the visitor sees and does | Motion and purpose |
| --- | --- | --- |
| Header and opening room | Actual logo, Works / Curtains & blinds / Contact navigation, headline “A different feeling. In every fold.”, factual subline “Curtains and blinds by Mac2Din2 House of Curtains.”, Contact us and View our work actions. | A room framed by substantial drapes. Content and contact are visible immediately while the optional 3D loads. |
| Room reveal | Scrolling parts the curtains and admits daylight. The room and fabric exist in real depth. | A bounded sequence: open the drapes, a gentle camera move, then a closer view of pleats. Native scrolling remains in control. |
| Fabric and light | A short explanation of sheers, layered drapes, and blinds. Selectable “Sheer,” “Layered,” and “Closed” views; two or three illustrative fabric swatches. | Reuse the same room and rendering context. Changes show how the room feels; clearly identified controls never depend on hover. |
| Selected installations | A large carousel of the saved real work with simple captions. Curtain and blind filters only when enough images exist in each category. | Swipe or drag horizontally; visible Previous / Next controls and slide count. A small next-image preview makes the carousel apparent. |
| Details from the work | A second, smaller carousel, using close views from the real installations where crops remain clear. | Quiet transitions and a restrained image parallax provide breathing room after the 3D experience. If no clean detail crops exist, show full frames rather than manufacture texture. |
| Contact | “Let’s talk about your windows.” with both phone numbers, Instagram, and a short invitation to mention curtain/blind type and share a room photo through the chosen channel. | A calm, readable finish. All inquiry routes are ordinary links. |

Header Contact us, the opening CTA, and a compact bottom contact action on mobile jump directly to `#contact`. View our work jumps to `#works`. These routes work before any animation JavaScript loads. Repeated project actions use the same Contact us wording.

## Contact behavior

Choose direct contact for release one. The contact section offers:

- Call 0917 836 1524: `tel:+639178361524`.
- Call 0922 816 9859: `tel:+639228169859`.
- Open Instagram: `https://www.instagram.com/mac2din2houseofcurtain/`, with supporting text “Tap Message on our profile.”

Use the honest label Open Instagram while the destination is a profile. A direct messaging link may replace it only after its destination is verified. Do not guess WhatsApp, Viber, email, or Messenger support from the presence of phone numbers or social links. Do not add a form with no delivery service behind it.

No inquiry is sent by this site automatically. A visitor chooses a contact channel and completes the call or message there. If analytics is configured later, measure contact-link clicks as intent; do not report those clicks as confirmed conversations. Deployment domain and analytics account remain optional launch configuration, not invented facts.

## Motion choreography

Desktop starting point: one approximately 300svh sequence containing a 100svh sticky room, meaning about two additional viewports of actual scroll. The renderer is shared across the opening and fabric/light beats. The exact duration is a builder tuning choice within a 240–320svh envelope after testing.

1. At entry, partially closed drapes give the room depth; headline, logo, and CTA are already present.
2. During early scroll, left and right cloth gather toward the sides. Pleats compress, hems settle, and the light pool widens.
3. During the middle beat, the camera moves gently toward the window, with near fabric moving faster than the distant room.
4. At the close view, allow fabric/light controls. Scrolling alone still completes the narrative; interaction is optional.
5. Pull back to a composed room and release the sticky area into actual installations.

Build real 3D drapes with thickness, pleat depth, believable gathering, soft shadows, and material roughness. Start with authored or procedural pleated meshes and baked open/closed poses, plus restrained shader deformation. Avoid a runtime cloth physics dependency; it complicates repeatable scroll poses. This is an art-quality task: a flat texture sliding sideways is not sufficient for the requested experience.

Use one active WebGL canvas; pause rendering offscreen and when hidden, and render on demand when the scene settles. Scroll updates mesh state and invalidates frames without re-rendering React on every scroll event. Use baked room lighting, compressed local assets, limited transparent layers, and capped/adaptive resolution. Never put primary text or links inside the canvas.

Portfolio parallax is local and small, approximately 16–32px on desktop, with enough crop overscan to avoid exposed edges. Do not move the page background, tilt text, replace the cursor, play sound automatically, or force horizontal scrolling through vertical wheel input. Native vertical scroll remains usable over carousels.

## Carousels and image behavior

Curate the best four or five verified source frames for the main carousel; do not pad the set with generic interiors. Inspect all five source files before selecting. Preserve visible watermarks and installed products. Do not assert project locations or client names.

Use finite, manual carousels with swipe/drag, buttons, keyboard operation, meaningful alt text, current slide indication, and disabled controls at the ends. No automatic advancement. On phones show one large frame and a portion of the next; on wide screens show one dominant frame and a smaller preview. Captions and contact controls remain readable outside the image.

Avoid nested swipe areas. The second carousel is a separate page section. Expand an image into a keyboard-accessible lightbox only if it improves inspection; if used, restore focus on close, support Escape, and provide a visible close button. The builder may omit the lightbox for a simpler first release.

Use local responsive AVIF/WebP delivery with source-appropriate sizing and intrinsic dimensions. Keep original copies and source attribution in the repository. Do not hotlink expiring Instagram asset URLs or embed a live social feed.

## Mobile, accessibility, and failure states

- At narrow widths, use a portrait room framing and a shorter approximately 160–200svh narrative. Keep at least a subtle real 3D effect on capable phones; reduce detail and resolution before removing it.
- For reduced-motion preference, Data Saver when detectable, unavailable WebGL, context loss, scene-load error, or sustained poor rendering performance, show a locally rendered room poster and ordinary flowing sections. Skip camera travel, parallax, and pin spacing. Preserve the same products, photos, and contact access.
- The initial HTML includes the copy, navigation, project images, and contact section. With JavaScript disabled, gallery frames remain accessible in a simple list or native overflow strip.
- A scene error never removes the page or traps scroll. Loading does not block contact. A missing gallery image leaves a stable aspect-ratio slot, useful caption, and source link rather than broken layout.
- Respect keyboard focus, logical reading order, zoom, semantic headings, descriptive control labels, 44px touch targets, and WCAG AA text contrast. Motion may be disabled at any time without losing content.
- Test layouts from 320px through wide desktop. Bottom contact UI accounts for device safe areas and never covers gallery controls or footer contact links.

## Recommended build approach

Use Astro for statically rendered copy, navigation, images, and search-friendly content. Hydrate a React island only for the 3D scene, using Three.js through React Three Fiber. GSAP ScrollTrigger coordinates scroll poses and section timing. Start the gallery with native CSS scroll snap and a small button/controller layer; add a carousel library only if real interaction testing justifies it. Use TypeScript, ordinary scoped CSS, and local image assets. No backend is necessary for the selected contact flow.

This is the recommended path rather than a framework requirement. Confirm compatible stable package versions and lock them when building. No dependencies were installed during planning.

Documentation checked on 2026-10-30:

- Astro islands: https://docs.astro.build/en/concepts/islands/
- React Three Fiber performance: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

## Build roadmap and review gates

| Stage | Deliverable | Evidence before moving on |
| --- | --- | --- |
| 1. Asset preparation and static page | Source-faithful web logo, inspected and optimized project images, typography, complete page copy, contact anchors. | Check the actual logo against the source at normal and 2× header sizes. Confirm all links and business facts. Render the complete page on phone and desktop. |
| 2. 3D feasibility and art pass | One composed room with believable closed/open curtain states, pleats and lighting; local fallback poster. | Compare entry, half-open, open, and close-view frames. Test on a real phone if available. Resolve cloth quality and speed before extending the choreography. |
| 3. Scroll narrative and material controls | Connected room reveal, camera/parallax, optional style states, responsive sequence. | Fast and reverse scroll, resize/orientation change, direct anchor navigation, keyboard, reduced motion, and slow loading remain usable. |
| 4. Project carousels and contact integration | Two purposeful galleries, captions, touch and keyboard controls, repeated contact actions. | Swipe preserves vertical scroll, ends are correct, no automatic movement, assets/captions match sources, phone and Instagram destinations are correct. |
| 5. Delivery checks | Optimized static build and launch-ready files. | Production build, visual review at 320/390/768/1440px, accessibility and performance checks, no-JS/WebGL/load-error fallbacks, contact-link verification. |

Proposed measurable budgets, to be tested rather than promised: first mobile critical assets around 1MB or less before optional 3D; hero poster at most 250KB; optional compressed 3D payload about 4MB or less; aim for 60fps desktop and at least 30fps on the representative phone. If the scene cannot meet that floor, reduce shadows/transparency/resolution and use the poster fallback. Aim for LCP at or below 2.5s, CLS at or below 0.1, and INP at or below 200ms; lab measurements guide launch, and field percentiles require real traffic.

## Scope boundaries and remaining launch facts

This handoff is a design and roadmap with source assets. It does not claim that the logo has been retouched, that 3D artwork exists, that the website runs, or that hosting has been configured. A later implementation should begin with the asset/static-page stage and the 3D feasibility gate.

No additional preference questions are needed to start a build from this recommendation. A custom domain, optional analytics, a higher-quality source logo if one exists, and additional project images may improve launch but are not blockers. Confirm service area, address, hours, pricing, and any customer quotes only if they will be added. Keep all source files intact.
