# Migration acceptance gates

A migration may ship only when all applicable gates pass. A blocked gate remains a release blocker unless the user explicitly approves withholding the affected unpublished page or function.

## Repository and lock

- The client has its own repository derived from a recorded golden-master commit.
- `.migration/template-source.json` identifies the helper-selected golden master, exact commit, destination, and successful pre-copy lock check.
- `template.lock.json` validates.
- `pnpm check:lock` passes against the committed `template.lock.snapshot.json`; the baseline may not be regenerated during a client migration.
- Every locked path, including the lock contract, lock schema, and checker, exists and matches its golden-master checksum.
- Locked hero desktop/mobile videos, posters, playback behavior, and locked styling are unchanged.
- The locked cinematic film is visible as the first home viewport. For a niche-mismatched client it remains a user-approved template-owned atmospheric element, is not presented as client work, and supports no client factual claim.
- Client data/assets stay in declared replaceable roots; route/function/audit files stay in declared client-generated paths. No locked path changed without separate template authorization.

## Source and evidence

- Every approved source URL or artifact has a terminal inventory status.
- Every approved URL has a URL-parity row; no page is silently ignored.
- Every published factual value has resolvable evidence.
- Derived copy adds no unsupported factual meaning or superlative.
- There are no placeholders, invented claims, fake statistics, fabricated testimonials, assumed prices, or guessed legal details.
- Unsupported template pages and blocks are absent from the published manifest and navigation.

## Media

- Every published client asset records its original source, rights or consent, transformations, and responsive variants.
- Meaningful media has accurate alt text; decorative media is marked decorative.
- Unknown-rights media remains withheld.
- No unrelated template/client image is reused as filler. The explicitly locked cinematic home film is the sole standing exception and follows the repository's niche-mismatch policy above.

## Routes and navigation

- Every published page has unique ID and path, published content, metadata, and desktop/tablet/mobile parity results.
- Every internal target resolves; every published page is reachable through primary, contextual, utility, or footer navigation.
- There are no empty dropdowns, duplicate destinations, dead buttons, or actions that lead to the wrong page position.
- Redirects and static-host trailing-slash behavior match the approved URL plan.

## Functions and integrations

- Every source function has a function-parity row.
- Composite experiences are split into separate capability records when different systems determine completion; local calculation and remote CRM or delivery may not share one completion status.
- Publicly reproduced functions preserve evidenced inputs, outputs, validation, states, and purpose in the template design.
- Calculators, selectors, filters, and configurators pass deterministic evidence-backed fixtures.
- Forms and uploads cover validation, file constraints, empty, success, and error behavior appropriate to the real integration.
- Private or unavailable integrations are explicitly `blocked` or `frontend-only`, never reported complete.
- A published interface never falsely claims remote delivery, storage, booking, payment, authentication, or receipt.
- No secret, credential, or private client data is committed.

## Build and static delivery

- Formatting, lint, type checking, production build, and static export checks pass using repository-provided commands.
- Every published static route loads directly and after refresh without failed assets.
- Sitemap, robots, canonical URLs, metadata, structured data, redirects, and headers reflect verified client data only.
- There are no browser console errors, failed required requests, hydration errors, or horizontal document overflow.

## Responsive and interaction parity

- Desktop QA includes at least `1440 × 900`.
- Tablet QA includes at least `768 × 1024`.
- Mobile QA includes at least `390 × 844`; also check a narrower supported width when the design requires it.
- Header, navigation, dropdowns, media, typography, calls to action, forms, tools, footer, and all important content remain available and usable at every viewport.
- `adapted` means a deliberate responsive presentation change without lost content or capability; it is not a waiver for missing mobile behavior.
- Keyboard focus, dialog focus management, labels, reduced-motion behavior, touch targets, and contrast have no critical failures.

## Completion threshold

- Zero unapproved locked-path changes.
- Zero schema, evidence-reference, route, build, or static-delivery errors.
- One hundred percent of approved source URLs, factual content items, media assets, and source functions have terminal parity records.
- Published parity contains no `pending`, `failed`, or `blocked` status. Explicitly approved unpublished or withheld functions may retain blocked parity and must remain absent from public routes and navigation.
- Every approved omission and every remaining block is listed in the handoff with its impact and required owner action.
