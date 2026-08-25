# Granit Decor — production-ready website demo

A Lithuanian-first, static-exportable website for Granit Decor. It is designed as a premium natural-stone atelier experience rather than a generic construction template.

## What is included

- Responsive editorial homepage using authentic public Granit Decor project imagery.
- Exact public Granit Decor logo asset, with a vector master still recommended before launch.
- 133-item natural-stone catalog with local optimized assets.
- Search, filtering, favourites, quick view, and comparison.
- Thirteen complete, grouped and searchable application routes covering the public service range.
- Complete 118-image public work archive with nine filters and an accessible lightbox.
- Static material, application, and curated project routes.
- Guided project planner with validation and local draft persistence.
- Downloadable/copyable project summary; no fake form delivery.
- Process, professionals, about, contact, journal/care, memorial, privacy, and terms routes.
- Light/dark themes, reduced-motion support, keyboard navigation, and accessible focus/form states.
- Static production export; no server, database, CRM, email, calendar, or domain credentials required.

## Local use

Use Node.js 22 or newer.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Production checks and export:

```bash
pnpm check
```

The static site is generated in `out/` and can be uploaded to a static host.

## Honest demo behaviour

- The project planner and contact form do not transmit data. They state this visibly and create a local summary instead.
- Favourites, comparison, theme, and planner draft use browser local storage only.
- No exact price, availability, origin, finish, suitability, guarantee, project date, collaborator, or response-time claim is invented.
- Project images are conservatively labelled by the visually evident application only.

## Before public launch

The client must confirm:

1. Rights to every project photo and supplier swatch used publicly.
2. Correct public address, phone, email, hours, legal details, and whether visits require an appointment.
3. Every material name and any future origin, finish, thickness, suitability, stock, price-band, or care field.
4. Real case-study names, locations, stone, scope, date, and collaborators.
5. A production vector master of the currently published Granit Decor logo.
6. Privacy controller details, retention period, form recipient, consent wording, and cookie/analytics plan.
7. CRM/email/file-upload integration and the true response workflow.
8. Confirm that `https://www.granitdecor.lt` is the final canonical production URL before deployment; the current metadata and sitemap use it.

## Asset maintenance

Project and material images are self-hosted WebP files. Source references and limitations are documented in `ASSET_PROVENANCE.md`. The material seed data retains source URLs and confirmation notes in `src/data/materials.ts`.

## Design source of truth

- Navigation brief: `.design/navigation-system/DESIGN_BRIEF.md`
- Navigation architecture: `.design/navigation-system/INFORMATION_ARCHITECTURE.md`
- Navigation review: `.design/navigation-system/DESIGN_REVIEW.md`
- Cinematic hero brief: `.design/cinematic-hero/DESIGN_BRIEF.md`
- Cinematic hero review: `.design/cinematic-hero/DESIGN_REVIEW.md`
- Tokens: `src/styles/tokens.css`
