# Design brief: Granit Decor showroom system

## Direction

Create a premium Lithuanian natural-stone website whose interaction and layout discipline are recognizably inspired by Salvatori's current global website, while retaining Granit Decor's own identity, logo, photographs, services, catalogue, language, and commercial purpose.

Named philosophy: **quiet Italian showroom precision**.

## Required qualities

- Luxurious through material imagery, proportion, typography, and restraint rather than decorative effects.
- Flat white navigation surfaces, exact alignment, square corners, minimal shadow, and thin rules.
- Professional Instrument Sans typography with controlled heading sizes and direct Lithuanian labels.
- Every primary desktop navigation item opens a useful image-led panel; different content counts produce intentionally different panel compositions.
- Mobile navigation becomes a full-screen, text-only drill-down with Back and Close controls.
- High-frequency interactions finish in roughly 150–300ms; the mobile pane transition may take 500ms.
- No small numbered labels, ornamental numbering, generic captions, fake facts, invented pages, or commerce controls that do not match Granit Decor's business.

## Functional scope

- Six desktop mega menus: Gaminiai, Akmuo, Projektai, Kaip dirbame, Profesionalams, Apie mus.
- Hover discovery and click-pinning on desktop; scrim, Escape, outside click, and visible collapse affordance.
- Search across services, all stones, projects, primary pages, and journal pages.
- Saved-stone drawer backed by the existing local saved-material state.
- Workshop/location modal using the already published Lentvaris contact details.
- Mobile root menu and second-level panes generated from the same typed navigation data.
- Responsive footer directories that become disclosure rows on mobile.
- Correct top-of-page behavior for normal routes and correct target scrolling for cross-route fragments.

## Visual rules

- Mega-menu images: consistent 3:4 ratio, 120×160px at full desktop width.
- Catalogue imagery: controlled 3:4, square, 4:3, or wide editorial ratios; no arbitrary floating gaps.
- Primary palette: chalk/white, graphite, warm alabaster, and the existing muted Granit Decor burgundy.
- Body text remains at least 16px on mobile. Navigation labels may be smaller where their role is unambiguous.
- Controls have at least 44×44px hit areas on touch devices and visible keyboard focus.

## Success criteria

- A visitor can reach every existing product service, stone family, representative project, process section, professional section, and company section within two navigation decisions.
- Menus remain open while the pointer travels into them and stay open when pinned.
- All overlays and dialogs are keyboard-operable and close predictably.
- The full static export builds without errors, all public routes resolve, and no tested viewport has horizontal overflow.
