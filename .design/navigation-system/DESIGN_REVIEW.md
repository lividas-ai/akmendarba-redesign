# Design Review: Granit Decor showroom navigation and page system

Reviewed against: `DESIGN_BRIEF.md`

Philosophy: **quiet Italian showroom precision**

Date: 2026-08-25

## Screenshots Captured

| Screenshot | Breakpoint | Description |
| --- | --- | --- |
| `screenshots/review-homepage-desktop-1280.jpg` | Desktop (1280×800) | Full homepage structure and desktop hierarchy |
| `screenshots/review-homepage-tablet-768.jpg` | Tablet (768×1024) | Full homepage adaptation at the tablet boundary |
| `screenshots/review-homepage-mobile-375.jpg` | Mobile (375×812) | Full homepage stacking and mobile type scale |
| `screenshots/review-menu-products-desktop-1280.jpg` | Desktop (1280×800) | Eight-tile Gaminiai mega menu, rail links, close affordance, and scrim |
| `screenshots/review-menu-about-desktop-1280.jpg` | Desktop (1280×800) | Compact three-tile Apie mus menu composition |
| `screenshots/review-search-desktop-1280.jpg` | Desktop (1280×800) | Search overlay with live Patagonia result |
| `screenshots/review-menu-root-mobile-375.jpg` | Mobile (375×812) | Full-screen root navigation with six sections and utility links |
| `screenshots/review-menu-products-mobile-375.jpg` | Mobile (375×812) | Text-only Gaminiai drill-down with Back and Close controls |
| `screenshots/review-products-section-desktop-1280.jpg` | Desktop (1280×800) | Editorial product mosaic after its entrance reveal |
| `screenshots/review-stones-section-desktop-1280.jpg` | Desktop (1280×800) | Symmetrical five-column stone presentation |
| `screenshots/review-process-section-desktop-1280.jpg` | Desktop (1280×800) | Balanced process image and five-step content column |
| `screenshots/review-footer-desktop-1280.jpg` | Desktop (1280×800) | Static desktop directories with all product, stone, company, and contact links visible |

All screenshots are in `.design/navigation-system/screenshots/`. The three full-page stitches record breakpoint structure; because entrance reveals intentionally activate when sections enter the viewport, the additional section-level screenshots verify the fully rendered states a visitor actually sees while scrolling.

## Summary

The implementation meets the brief. It has the restrained, image-led rhythm of a premium stone showroom while remaining recognizably Granit Decor: all six primary sections now use one coherent mega-menu system, product and stone imagery is deliberately proportioned, mobile navigation genuinely reorganizes into a drill-down, and the former empty or oversized page areas are now balanced. No release-blocking visual or functional issue remained after the final review.

## Visual Hierarchy

Pass. The Granit Decor mark anchors the two-row desktop header; the primary project action remains visually strongest without competing with navigation. Menus use photographs for rapid recognition and a quieter right rail for secondary choices. The homepage product, stone, project, and process sections each have a clear reading order and controlled heading scale.

Evidence: `review-menu-products-desktop-1280.jpg`, `review-products-section-desktop-1280.jpg`, and `review-process-section-desktop-1280.jpg`.

## Consistency and Aesthetic Fidelity

Pass. White and warm neutral surfaces, graphite typography, restrained burgundy accents, square geometry, thin rules, consistent arrow treatment, and shadow-free panels support the named philosophy. Mega-menu photographs keep the required 3:4 ratio while the page uses intentional editorial ratios. The three-tile and eight-tile menus share the same visual grammar without creating artificial empty columns.

Evidence: `review-menu-products-desktop-1280.jpg`, `review-menu-about-desktop-1280.jpg`, and `review-stones-section-desktop-1280.jpg`.

## Component Quality

Pass. All desktop and mobile destinations come from the shared typed configuration in `src/data/mega-navigation.ts`; the header does not duplicate six separate menu implementations. Search, saved stones, location, footer, and scroll restoration are isolated components with single responsibilities. Existing material storage and canonical content data are reused rather than recreated.

## States and Interactions

Pass. Hover discovery, click pinning, same-trigger toggle, menu switching, pointer transfer, scrim closing, outside click, Escape, and focus return were exercised. Search auto-focuses, shows a strong focus indicator, announces result counts, handles diacritics, provides a real empty state, and returns the correct Patagonia result. Saved materials have both empty and populated behavior; removal is announced and keyboard focus moves safely to the next usable control. The location panel uses verified Granit Decor details.

Automated interaction review passed with 44 captured states, zero console errors, and zero failed responses.

## Responsive Behavior

Pass. Desktop uses a two-row showroom header. Tablet preserves hierarchy without overflow. At mobile width the design changes to a full-screen two-pane text navigation with six section buttons, a 500ms directional transition, and no menu imagery. Product grids and footer directories stack or disclose instead of merely shrinking. No tested viewport produced horizontal overflow.

Evidence: `review-homepage-tablet-768.jpg`, `review-homepage-mobile-375.jpg`, `review-menu-root-mobile-375.jpg`, and `review-menu-products-mobile-375.jpg`.

## Accessibility and Typography

Pass. The build uses semantic header, navigation, main, dialog, search, section, and footer landmarks; menu triggers expose expanded state and panel relationships; decorative images and icons are hidden appropriately; dialog controls have explicit labels; hidden mobile panes are inert; focus moves into a mobile submenu and returns to its originating section button; touch controls meet the 44px target; global focus styling remains visible; and reduced-motion behavior is provided. Desktop footer directories are static navigation groups while mobile uses semantically correct disclosure controls. Instrument Sans loads locally and the body/heading measures remain readable at reviewed breakpoints.

## Must Fix

None.

## Should Fix

None within the current demo scope.

## Could Improve Later

1. Replace any remaining catalogue placeholders with a final client-approved photography set when Granit Decor supplies higher-resolution originals.
2. Consolidate the historical header rules in `src/styles/components.css` during a later maintenance pass. The final cascade is correct and verified, so this is code housekeeping rather than a visible defect.
3. Connect project enquiries, analytics, consent storage, email, or CRM only when production credentials and the client's preferred workflow are provided.

## What Works Well

- Every primary section is discoverable through the same predictable interaction model.
- All 13 Granit Decor product services remain reachable without turning the menu into an overwhelming list.
- The product mosaic stays playful while its edges and gutters remain professionally aligned.
- The five-stone display is symmetrical and materially rich without oversized gaps.
- The process section now uses the available height purposefully instead of reading as unfinished whitespace.
- Search, saved materials, location, mobile navigation, and footer directories make the demo feel like a complete website rather than a static homepage concept.

---

## Viewport-safe media addendum

Reviewed: 2026-08-25

Scope: every public page archetype at 1280×800, plus homepage and critical mixed-orientation routes at 375×812.

### Evidence

| Screenshot | What it verifies |
| --- | --- |
| `screenshots/image-fit-after-home-projects-desktop-1280.png` | Three equal homepage project cards fit within one desktop viewport and retain their native portrait composition. |
| `screenshots/image-fit-after-homepage-mobile-375.png` | Homepage editorial media stacks without horizontal or viewport-height overflow. |
| `screenshots/image-fit-after-products-desktop-1280.png` | Service thumbnails use consistent, bounded 4:3 frames without empty letterbox bands. |
| `screenshots/image-fit-after-projects-desktop-1280.png` | Archive and full portfolio grids use compact, symmetrical showroom spacing. |
| `screenshots/image-fit-after-project-detail-desktop-1280.png` | A portrait project photograph uses a source-aware portrait frame instead of a full-width, over-height slot. |
| `screenshots/image-fit-after-about-desktop-1280.png` | The 3:2 image spread preserves both complete photographs at restrained sizes. |
| `screenshots/image-fit-after-stone-detail-desktop-1280.png` | Stone hero and pattern fragment remain under the viewport cap without the previous 1.45× image enlargement. |

### Findings and disposition

| Severity | Finding | Resolution |
| --- | --- | --- |
| High | Homepage lead project photograph rendered about 1,030px tall at 1280×800. | Replaced the row-spanning mosaic with three bounded 2:3 cards; the final desktop cards are 528px tall. |
| High | Featured archive cards could exceed the viewport and mixed portrait/landscape sources were forced into one tall ratio. | Removed row spanning, standardized the archive to three columns, and bounded every frame. |
| High | Stone-detail media could render beyond the viewport because of full-height grid sizing and a 1.45× transform. | Explicit 68svh sizing and removal of the enlargement keep both detail surfaces bounded. |
| Medium | A blanket `contain` rule introduced conspicuous empty bands around portrait and wide photographs. | Replaced it with portrait, vertical, square, 4:3, 3:2, and 16:9 source-aware frames; bounded thumbnails use a consistent editorial crop. |
| Medium | Supporting-page hero media used 85% of desktop viewport height. | Reduced to a 68svh maximum and matched the frame to the source orientation. |
| Low | Mobile stone and filter rails extend beyond the visible edge. | Retained as intentional, touch-scrollable rails; they do not create document-level horizontal overflow. |

### Final assessment

The media system now follows a clear rule: cinematic catalogue heroes may bleed, while project, service, article, process, and stone-detail photography remains bounded and source-aware. Production type checking, linting, and the complete 175-page static build pass.

**Approve.**
