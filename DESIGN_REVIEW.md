# Mobile parity design review

Review date: 2026-08-26

## Outcome

The mobile and tablet experience now preserves the same premium showroom identity as desktop. The hero uses the same 360-degree kitchen orbit, the complete Granit Decor wordmark is visible, navigation categories use compact visual previews, and editorial image proportions remain controlled across the site.

No demo-blocking visual issues remain in the reviewed routes and viewport sizes.

## Evidence

The local visual audit generated these representative captures in `screenshots/`:

- `review-hero-final-mobile-375.png` — mobile hero, wordmark, project label and playback control.
- `review-menu-gaminiai-final-mobile-375.png` — compact two-column visual product menu.
- `review-hero-final-tablet-768.png` — tablet hero and typography scale.
- `review-home-final-tablet-768.png` — tablet editorial grids and section rhythm.
- `review-hero-final-desktop-1280.png` — desktop reference after shared changes.
- `review-product-final-mobile-375.png`, `review-stone-final-mobile-375.png`, `review-project-final-mobile-375.png` and `review-project-form-final-mobile-375.png` — representative inner pages.

The captures can be regenerated with `scripts/capture-mobile-parity.mjs`. Route-level responsive checks live in `scripts/mobile-route-audit.mjs`.

## What works

- Mobile portrait video is an exact center crop of the production desktop orbit. It retains every frame, camera move, duration and loop point.
- Muted inline autoplay is requested immediately and retried when media becomes ready, the page returns to the foreground, or the hero re-enters the viewport.
- A visible pause/play control remains available without hiding the video behind a network or reduced-motion gate.
- Full logo and company name remain legible without competing with mobile controls.
- Product, stone and project submenus reuse desktop imagery in compact phone and tablet grids.
- `Profesionalams` and `Apie mus` remain direct links rather than redundant dropdowns.
- Phone imagery uses restrained rail widths; tablet product, material and project sections use compact multi-column layouts.
- Keyboard focus, safe-area spacing and accessible menu labels remain intact.

## Verification

- Reviewed at 320, 375, 390, 430, 768 and 1280 CSS pixels.
- Audited twelve representative routes at 375 and 768 pixels.
- No horizontal overflow, missing wordmark, route console errors, or oversized non-hero images were detected.
- Production TypeScript, ESLint and Next.js builds passed.

## Follow-up after client approval

- Test the deployed URL on one physical iPhone and one physical Android device with normal battery settings. Browser or operating-system power policies can still override any website's autoplay request; the poster and manual play control provide the fallback.
- Replace the raster source logo with a client-supplied vector master if one becomes available for maximum sharpness on high-density screens.
