---
name: migrate-client-website
description: Migrate an approved client website into the premium business template as a separate client repository, with evidence-backed content, preserved locked assets, recreated functions, and verified URL and responsive parity. Use for a new client migration or a migration-completeness audit; do not use for unrelated edits to an established site.
---

# Migrate Client Website

Use the premium template as a golden master, not as a multi-client repository. A migration is complete only when every approved source URL, factual item, media asset, and user-visible function has a verified destination, approved omission, or explicit blocked status.

## Non-negotiable invariants

- Create or work in one separate repository per client. Never place two client packages in one live repository and never convert the golden master into a client site in place.
- Treat `template.lock.json` as authoritative. Do not modify any `lockedPaths` entry during client import. In particular, preserve the locked hero video, its responsive versions and posters, its playback component, and associated locked styling byte-for-byte unless the user explicitly authorizes a template-level change.
- Replace client-owned data and assets inside `replaceableRoots`. After the source inventory and parity matrices exist, regenerate files matched by `clientGeneratedPaths`. A `lockedPaths` match always wins over a broader generated glob; changing a locked file requires explicit template-level authorization.
- Use only client-approved source URLs, files, interviews, datasets, and direct client statements. Do not expand the crawl to unrelated sources without authorization.
- Never invent business facts, claims, services, prices, statistics, testimonials, people, locations, credentials, project details, integrations, or legal language.
- Omit an unsupported page or section completely. Do not publish empty shells, generic filler, duplicated calls to action, or plausible-sounding substitute copy.
- Do not bypass authentication or simulate a private integration. Mark unavailable private dependencies as blocked and state what is required to complete them.
- Keep the locked cinematic kitchen film visible as the first home viewport for every client copy, including clients outside the stone or interiors niche. It is an explicitly user-approved, template-owned atmospheric element, not client media and never evidence that the client made the pictured kitchen. Do not attach client claims, project captions, or portfolio meaning to it. Replacing or hiding it requires a separate template-level decision.

## Start with a migration contract

Before changing client content:

1. Confirm the working repository is the intended client repository derived from the golden master. Creating or publishing a repository still requires the user's authorization.
2. Record the template commit and verify `template.lock.snapshot.json` with `pnpm check:lock`. The baseline includes `template.lock.json`, its schema, and the lock checker itself. Stop if the contract, baseline, or any locked file is missing or changed. Do not regenerate the baseline during a client migration.
3. Record the client's approved source scope and canonical production domain.
4. Create the source inventory and the URL, content, and function parity matrices before implementation. Use [references/migration-artifacts.md](references/migration-artifacts.md).
5. Identify missing access, usage rights, credentials, legal decisions, and other client-owned inputs early. Record them in the blocked ledger; do not fill the gaps.

## Inventory every approved source

- Crawl every approved start URL, its same-scope sitemap, and reachable internal links. Canonicalize URLs while retaining redirects, query-dependent views, downloads, and fragments that expose distinct content or behavior.
- Record retrieval time, capture status, checksum when practical, and the source locator needed to support each extracted fact.
- Inventory all visible media with original URL, published destination, dimensions or duration, transformations, rights, and consent status.
- Exercise and inventory every user-visible function: forms, search, filters, comparison, favourites, calculators, selectors, configurators, uploads, downloads, maps, booking, authentication, payments, and external hand-offs.
- For each function, capture inputs, outputs, validation, states, persistence, errors, integration dependencies, and representative evidence-backed test cases.
- Mark inaccessible pages or private dependencies `blocked`; do not treat them as reviewed or silently exclude them.

## Build an evidence-backed client package

- Put client data and client-owned assets in the declared replaceable roots. Keep audit artifacts and generated route/function adapters only in their declared `clientGeneratedPaths`.
- Represent sources, factual text, media provenance, functions, pages, navigation, publication state, and device parity through the template manifest and schema.
- Every published factual value must reference at least one valid source record. Derived copy must retain its evidence and explain the transformation without adding new factual meaning.
- Template-owned interface labels such as “Menu” and “Back” may use UI origin. Promotional claims and business descriptions may not.
- Publish meaningful media only with evidence, alt treatment, responsive variants, and confirmed rights. Preserve original-source provenance through optimization or editing.
- Generate navigation only from published pages. Do not create empty dropdowns, duplicate destinations, or links to withheld pages.
- Keep unsupported records `draft` or `withheld`; rendering must consume only `published` records.
- Build every client home route with the locked manifest page renderer so the cinematic film remains the first viewport. A generated client page may change the evidenced copy and following blocks, but may not disable or bypass the locked home hero.

## Recreate functions honestly

- Rebuild each public source function in the template's visual system while preserving its observable purpose, inputs, outputs, validation, states, and keyboard/mobile behavior.
- Register implementations through the template function layer and validated configuration. Never store executable client JavaScript in content data.
- Split composite tools into independently testable capabilities whenever completion depends on different systems. For example, represent a quote calculation and CRM lead delivery as separate function records: the evidenced local calculation may be `complete`, while remote delivery remains `frontend-only`, `blocked`, or withheld until its real integration passes.
- Use evidence-backed fixtures for calculators, selectors, filters, and configurators. Do not guess formulas, option sets, defaults, units, availability, or results.
- A public function backed by an unavailable CRM, booking system, account, database, email service, payment provider, or private API remains `blocked` or `frontend-only`, never `complete`.
- A demo shell may be shown only when its non-delivery is explicit. It must not claim that data was sent, saved remotely, booked, paid, or received.
- Give every source function a terminal parity status in the function matrix; never drop functionality because it is difficult.

## Prove parity before release

Maintain three linked matrices throughout the work:

- **URL parity:** every approved source URL maps to a destination URL, an approved omission, or a blocked item.
- **Content parity:** every factual source item maps to a destination record or an approved omission, with evidence references.
- **Function parity:** every source function maps to a tested implementation, an approved adaptation, or a documented block.

`equivalent` means the same content or behavior is available. `adapted` means presentation changed without losing meaning or capability. An omission requires explicit approval; a block requires a concrete dependency and user-visible impact.

## Required verification

Use the repository's actual scripts rather than assuming command names. At minimum:

1. Run `pnpm check:lock` against the persisted golden-master baseline and confirm the lock contract, checker, hero assets, playback component, and locked styling are unchanged. Never use `pnpm snapshot:lock` in a client migration.
2. Validate the client manifest in release mode and resolve every broken evidence or internal reference.
3. Run formatting, lint, type checks, production build, and static export checks provided by the repository.
4. Test every recreated function with evidence-backed success, validation, empty, error, and persistence cases where applicable.
5. Run the route/static audit over every published URL, not only the homepage.
6. Run browser QA at desktop, tablet, and mobile sizes. Verify navigation, media, forms and tools, responsive content parity, focus order, no horizontal overflow, no failed requests, and no console errors.
7. Compare representative screenshots and interaction results against the parity matrices.

Read [references/acceptance-gates.md](references/acceptance-gates.md) before declaring the migration complete.

## Handoff

Report:

- client repository and template source commit;
- approved source scope and crawl totals;
- URL, content, function, and media parity totals;
- blocked dependencies and the exact client action needed;
- locked-path verification;
- build, static, desktop, tablet, mobile, and function-test results;
- approved omissions and unresolved release blockers.

Do not call a migration complete while a source row is unmapped, a factual item lacks evidence, a function is silently missing, a locked path changed, or a release gate is pending or failed.
