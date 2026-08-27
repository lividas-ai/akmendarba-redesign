# Migration artifacts

Keep these artifacts in a client repository under `.migration/` or another explicitly agreed audit directory. Machine-readable JSON or TypeScript records may supplement the tables, but the human-readable status must remain reviewable.

## Template source record

Create `.migration/template-source.json` before changing client content. Record:

- the selected golden-master absolute path;
- the exact source commit and branch;
- the destination client repository path and branch;
- the UTC creation timestamp;
- the `CI=true pnpm check:lock` command result;
- the lock contract and snapshot checksums.

This record proves that the migration came from the registered protected template rather than an older client draft.

## Source inventory

| Source ID | Approved URL or artifact | Type | Retrieved | Capture status | Checksum | Notes |
|---|---|---|---|---|---|---|
| `source-home` | `https://client.example/` | URL | ISO timestamp | captured / partial / blocked | hash | Scope or access limitation |

`captured` means the source was read successfully. `partial` names what was unavailable. `blocked` names the access or dependency required. A source is never “complete” merely because the homepage was captured.

## URL parity matrix

| Source URL | Source ID | Destination URL | Status | Content rows | Function rows | Evidence or approval |
|---|---|---|---|---:|---:|---|
| `/source-path` | `source-path` | `/destination/` | migrated / adapted / intentional-omit / blocked | 0 | 0 | IDs or approval note |

Include canonical pages, redirects, downloads, query-dependent views, and publicly reachable utility pages. Every approved source URL needs one terminal row.

## Content parity matrix

| Content ID | Source and locator | Factual item | Destination page and block | Evidence refs | Status | Notes |
|---|---|---|---|---|---|---|
| `content-001` | `source-home#services` | Exact source fact | `/services/`, `services-grid` | `source-home#services` | migrated / adapted / intentional-omit / blocked | No new claim |

Split independently verifiable claims, contact details, catalogue items, project facts, legal text, and metadata into separate rows. Interface labels do not need factual evidence.

## Function parity matrix

| Function ID | Source URL | Function | Inputs and outputs | Destination | Integration | Fixtures | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| `function-001` | `/calculator` | Calculator | Inputs, units, result | `/calculator/` | complete / frontend-only / blocked | Fixture IDs | equivalent / adapted / blocked | Missing dependency or deliberate UI adaptation |

Record validation, empty/loading/error/success states, persistence, accessibility, mobile behavior, external hand-offs, and private services. Never use `equivalent` when only the visual shell exists.

## Media provenance ledger

| Media ID | Published path | Original source | Rights/consent | Original dimensions | Transformations | Responsive variants | Status |
|---|---|---|---|---|---|---|---|
| `media-001` | `/client/...` | URL or artifact ID | confirmed / blocked | width × height or duration | crop, resize, transcode | paths | ready / withheld / blocked |

Template-owned locked hero assets remain template provenance and must retain their original checksums.

## Blocked integration ledger

| Block ID | Source ID | Manifest function ID | Publication | Approval ID | Missing dependency | User-visible impact | Safe current behavior | Required client action | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `block-booking-delivery` | `source-booking` | `function-booking-delivery` | withheld | `approval-001` or pending | Private API credentials | Cannot create booking | Withheld or explicitly local demo | Provide scoped credentials and workflow | Client | blocked |

Do not put secrets in this ledger. Record only the dependency type and the secure hand-off that is required.

When one source interface performs both a local calculation and a remote hand-off, create separate function and ledger rows. A working local result never proves that CRM, booking, payment, upload, email, or database delivery works.

## QA report

| Area | Command, route, or viewport | Expected | Result | Artifact | Status |
|---|---|---|---|---|---|
| Build | Repository production check | Successful static production output | Result summary | Log ID | pass / fail / blocked |
| Mobile | `390 × 844`, route | Content and function parity, no overflow | Result summary | Screenshot ID | pass / fail |

Include lock verification, manifest release validation, all published routes, function fixtures, desktop, tablet, mobile, keyboard navigation, failed requests, console errors, and static-host behavior.
