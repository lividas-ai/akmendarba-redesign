<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Reusable premium website contract

- This repository is the golden master. Build each client in a separate repository; never combine client packs in one production app.
- Read `TEMPLATE_SPEC.md` and `template.lock.json` before a migration. Locked paths take precedence over generated globs and are changed only with explicit template-level authorization.
- Inventory all approved source URLs, factual items, media, downloads, and visible functions before implementation. Keep the audit artifacts in `.migration/`.
- Never invent client facts. Derived copy keeps evidence and may improve clarity without adding new factual meaning. Remove unsupported template sections completely.
- Preserve the locked 360° hero desktop/mobile videos and posters for new client builds until the user explicitly unlocks them. Keep the film visible as the first home viewport; it is template atmosphere and must never be described as client work.
- Recreate every evidenced client function in the template design. Mark inaccessible private integrations blocked or frontend-only; never fake delivery, booking, payment, storage, or receipt.
- Split local calculation/selection from remote CRM, booking, payment, upload, or delivery when they have different completion states.
- Render only published manifest records. Generate navigation and sitemap from published pages and use explicit route adapters for static output.
- Before release run the committed lock-baseline check, release manifest validation, typecheck, lint, manifest tests, normal build, static build, and desktop/tablet/mobile browser QA. Never regenerate the lock snapshot during a client migration.
