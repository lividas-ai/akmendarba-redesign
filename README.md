# Premium business website template

A production-grade Next.js golden master for building a separate premium website repository for any business with Codex. The visual system, cinematic 360° hero film, responsive behaviour, accessibility patterns, and evidence validators are reusable. Client facts, pages, functions, routes, and owned media are replaced from approved sources.

This is deliberately not a multi-tenant CMS. Create one repository and one deployment per client so content, assets, metadata, storage, and permissions cannot leak between businesses.

## What the template guarantees

- The current desktop and mobile hero videos, posters, playback behaviour, design tokens, shell, and validation engine are protected by `template.lock.json`.
- The cinematic kitchen film remains visible as a template-owned atmospheric first viewport for every client copy. It is never described as that client's work; hiding or replacing it is a separate template decision.
- Every source page, factual content item, media asset, and visible function receives a source-to-destination coverage record.
- Unsupported template sections are omitted; missing client information is never replaced with generic marketing copy.
- Client-only pages and tools may be added in the same editorial design language.
- Calculators, selectors, forms, uploads, search, filters, and other source functions are registered and tested. Missing private integrations remain explicitly blocked rather than pretending to work.
- Published pages, media, functions, navigation, evidence, local assets, and desktop/tablet/mobile parity are checked before release.

## Reference implementation

The repository currently includes the Granit Decor redesign as a complete reference client pack:

- 170 inventoried routes;
- 133 material records and a searchable selector;
- 118 portfolio images;
- project-planning flow with local draft/file selection;
- responsive editorial pages and image-led navigation.

The reference pack proves the template against a large real site. It is not release-ready until the client confirms media rights and supplies the real form/CRM delivery workflow. The release validator blocks publication for exactly those unresolved items.

## Start a new client in Codex

1. Start the migration from any folder in this Codex project. The installed skill locates and validates this registered golden master before creating a new client repository; it never overwrites the template or an existing client repository.
2. Provide the client's approved website URL, any additional approved files or URLs, and the intended domain.
3. Ask Codex to use the `migrate-client-website` skill.
4. Codex inventories every source URL, download, product, service, factual item, media asset, and user-visible function before editing the site.
5. Review the generated source, URL, content, media, and function parity records in `.migration/`.
6. Supply any blocked rights, credentials, legal details, or private workflows.
7. Run the full template checks and deploy the resulting client repository to its own Vercel project.

The reusable skill source is kept in `codex-skill/migrate-client-website/`. Its acceptance rules are stricter than a normal visual redesign because a beautiful homepage is not considered complete while source information or functionality is missing.

Copy the short request in `NEW_CLIENT_INTAKE.md` into a new Codex task to start a client without reattaching the template.

## Project boundaries

- `src/template/` — locked evidence schema, validators, and manifest renderer.
- `src/client/` — stable active-client imports plus the replaceable reference client pack.
- `src/app/` — protected root shell and generated explicit route adapters.
- `public/assets/video/` — the four locked production hero deliveries only.
- `codex-skill/migrate-client-website/` — reusable Codex migration workflow.
- `.migration/` — per-client inventory, parity, blockers, rights, and QA evidence.
- `template.lock.json` — machine-readable locked, replaceable, and client-generated boundaries.

## Local development

Use Node.js 22 and pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.

## Validation and builds

```bash
pnpm validate:client          # draft: report blockers without hiding them
pnpm validate:client:release  # release: fails on any blocker
pnpm test:manifest            # validator/reporting fixtures
pnpm check:lock               # compare protected files with the committed baseline
pnpm check                    # type, lint, tests, normal build, static export
```

Use `pnpm build:release` or `pnpm build:static:release` only after client approvals and integrations are complete. Static output is written to `out/`.

`pnpm snapshot:lock` is a golden-master maintenance command. Never run it while adapting the template for a client.

## Non-negotiable release rule

Do not publish merely because the site renders. Release requires complete source coverage, evidence-backed factual copy, confirmed media rights, working registered functions, resolved routes, and approved desktop/tablet/mobile parity. Every intentional omission needs a recorded approval; every remaining block needs an owner and a concrete next action.
