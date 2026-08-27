# Information architecture: reusable premium business template

## Structural principle

The site has a stable presentation system but no mandatory marketing sections beyond the global shell. The client manifest is the only authority for published pages, navigation, media, and functions. A record without sufficient evidence cannot enter the published tree.

## Conditional site map

```text
Home /
├── Verified identity and primary offer
├── Optional service or product collections
│   └── Optional detail pages
├── Optional project or case-study collection
│   └── Optional detail pages
├── Optional documented process
├── Optional professional/audience page
├── Optional about/trust content
├── Optional articles/resources
│   └── Optional article detail pages
├── Optional verified contact/conversion action
└── Template-owned decorative hero film

Optional collection /{collection}
└── Optional item /{collection}/{item}

Optional client function /{tool}
├── Calculator
├── Selector
├── Configurator
├── Form/workflow
└── Registered custom implementation

Optional arbitrary page /{explicit-path}

Required legal pages
└── Only when required for the chosen deployment, data collection, or jurisdiction
```

## Navigation rules

- Navigation points to page or function IDs; URLs are resolved from one registry.
- Five to seven primary destinations is the target, never a hard requirement.
- Maximum depth is two levels in global navigation.
- A direct destination does not open a dropdown containing the same destination.
- A dropdown exists only when it contains at least two distinct, published child destinations.
- Image-led tiles appear only when verified media exists. Otherwise the navigation uses a deliberate text layout with no empty image placeholders.
- Desktop and mobile consume the same navigation data. Only presentation changes.
- Every published non-legal page is reachable from navigation, a collection, a contextual link, or search.

## Page model

Every page has:

- a stable ID and explicit path;
- a page kind used only to select a suitable presentation;
- a publication state;
- evidence-backed title and SEO fields;
- an ordered list of blocks;
- desktop, tablet, and mobile parity results.

Supported core block families:

- cinematic or editorial hero;
- rich text;
- image, video, or document media;
- collection/grid/rail/list;
- factual key-value information;
- process/timeline;
- project/gallery;
- call to action;
- registered client function.

Client packages may add a strongly typed block implementation. Unknown block types fail validation; they never silently disappear.

## Function architecture

Client functions use an implementation registry, not executable code stored in content.

```text
Function record
├── Evidence and source behaviour
├── Input schema
├── Output schema
├── Validated configuration
├── Named implementation key
├── Deterministic fixtures
├── Integration status
└── Three-viewport parity result
```

If visible calculations or selection rules can be verified, they are reimplemented and tested. A composite experience is split into separate capabilities when local calculation and remote delivery have different dependencies. If a private endpoint, account, licence, or secret is unavailable, the delivery capability may remain withheld and blocked while an independently verified local capability ships; a published disconnected delivery shell is never treated as complete.

## Source-to-site flow

```text
Approved client sources
→ source URL/file inventory
→ content + asset extraction
→ factual evidence references
→ page/function mapping
→ client manifest
→ template rendering
→ automated validation
→ desktop/tablet/mobile QA
→ source parity sign-off
```

## Route rules

- Preserve meaningful source URLs when practical; record every redirect when a URL changes.
- Paths are explicit in the client manifest and checked for duplicates.
- Collection paths may be nested, but generated static routes must be known at build time.
- Unknown paths return a real not-found response.
- Fragment links must target existing IDs and must not be overridden by global scroll reset.
- Canonical URLs and sitemap entries come from the active client package, never a template default.

## Release gates

- Zero schema, duplicate-ID, duplicate-path, or unresolved-reference errors.
- Every published factual text value has valid evidence.
- Every published media asset has provenance, rights status, alt treatment, and a responsive delivery decision.
- Every published function has a registered implementation, valid configuration, and passing fixtures.
- Every published page, block, and function is reviewed on desktop, tablet, and mobile.
- No pending, failed, or blocked parity state on published records in a production release. Explicitly approved withheld functions remain outside public routes and navigation.
- No placeholder facts, invented claims, empty dropdowns, duplicate destinations, broken links, or orphan pages.
- Build, type checking, lint, internal-link audit, accessibility-critical checks, overflow checks, and performance budgets pass.
