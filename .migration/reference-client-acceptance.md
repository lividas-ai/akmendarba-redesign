# Site manifest acceptance report

- Site ID: `akmendarba`
- Schema version: `1.0.0`
- Validation mode: `draft`
- Current-mode acceptance: **PASS**
- Release readiness: **BLOCKED**

## Exact inventory

| Entity | Count |
| --- | --- |
| Pages | 15 |
| Media assets | 150 |
| Media variants | 150 |
| Functions | 3 |
| Sources | 15 |
| Source coverage records | 15 |
| Evidence references | 298 |

- Pages by publication: published: 15
- Pages by kind: contact: 1, custom: 1, detail: 4, home: 1, index: 6, legal: 2
- Media by kind: image: 148, logo: 2
- Media rights: unknown: 150
- Functions by type: custom: 1, form: 1, selector: 1
- Functions by integration: complete: 2, frontend-only: 1
- Sources by kind: client-input: 1, url: 14
- URL source status: captured: 14
- Coverage status: migrated: 15
- Coverage destinations: 17
- Unique evidence sources referenced: 15

## Parity

| Entity | Device | Total | Equivalent | Adapted | Intentional omit | Pending | Failed | Blocked |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| page | desktop | 15 | 0 | 0 | 0 | 15 | 0 | 0 |
| page | tablet | 15 | 0 | 0 | 0 | 15 | 0 | 0 |
| page | mobile | 15 | 0 | 0 | 0 | 15 | 0 | 0 |
| media | desktop | 150 | 0 | 0 | 0 | 150 | 0 | 0 |
| media | tablet | 150 | 0 | 0 | 0 | 150 | 0 | 0 |
| media | mobile | 150 | 0 | 0 | 0 | 150 | 0 | 0 |
| function | desktop | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| function | tablet | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| function | mobile | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| block | desktop | 34 | 0 | 0 | 0 | 34 | 0 | 0 |
| block | tablet | 34 | 0 | 0 | 0 | 34 | 0 | 0 |
| block | mobile | 34 | 0 | 0 | 0 | 34 | 0 | 0 |

Release-active unresolved parity checks: **606**

- page `page-home` · desktop: `pending`
- page `page-home` · tablet: `pending`
- page `page-home` · mobile: `pending`
- page `page-about` · desktop: `pending`
- page `page-about` · tablet: `pending`
- page `page-about` · mobile: `pending`
- page `page-monuments` · desktop: `pending`
- page `page-monuments` · tablet: `pending`
- page `page-monuments` · mobile: `pending`
- page `page-grave-coverings` · desktop: `pending`
- page `page-grave-coverings` · tablet: `pending`
- page `page-grave-coverings` · mobile: `pending`
- page `page-accessories` · desktop: `pending`
- page `page-accessories` · tablet: `pending`
- page `page-accessories` · mobile: `pending`
- page `page-finishing` · desktop: `pending`
- page `page-finishing` · tablet: `pending`
- page `page-finishing` · mobile: `pending`
- page `page-gallery` · desktop: `pending`
- page `page-gallery` · tablet: `pending`
- page `page-gallery` · mobile: `pending`
- page `page-gallery-monuments` · desktop: `pending`
- page `page-gallery-monuments` · tablet: `pending`
- page `page-gallery-monuments` · mobile: `pending`
- page `page-gallery-grave-coverings` · desktop: `pending`
- page `page-gallery-grave-coverings` · tablet: `pending`
- page `page-gallery-grave-coverings` · mobile: `pending`
- page `page-gallery-accessories` · desktop: `pending`
- page `page-gallery-accessories` · tablet: `pending`
- page `page-gallery-accessories` · mobile: `pending`
- page `page-gallery-finishing` · desktop: `pending`
- page `page-gallery-finishing` · tablet: `pending`
- page `page-gallery-finishing` · mobile: `pending`
- page `page-materials` · desktop: `pending`
- page `page-materials` · tablet: `pending`
- page `page-materials` · mobile: `pending`
- page `page-contact` · desktop: `pending`
- page `page-contact` · tablet: `pending`
- page `page-contact` · mobile: `pending`
- page `page-cookies-lt` · desktop: `pending`
- **566 additional parity issues are not expanded here; the total remains exact.**

## Local media

- Local variants: 150
- External variants: 0
- Invalid variants: 0
- Existing local variants: 150
- Missing local variants: 0
- Unique existing local files: 150
- Unique local file bytes: 10646587 (10.15 MiB)

## Current-mode validation

- Total: 1
- By severity: warning: 1
- By category: function: 1
- By code: incomplete-published-function: 1

- **WARNING · incomplete-published-function** — functions[0] (function-contact-enquiry) — Published function function-contact-enquiry is frontend-only.

## Release blockers

- Total: 757
- By category: function: 1, parity: 606, rights: 150
- By code: incomplete-published-function: 1, release-parity-incomplete: 606, unknown-media-rights: 150

- **ERROR · unknown-media-rights** — media[0] (media-paminklas-paprastas-1) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[0].parity.desktop (media-paminklas-paprastas-1) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[0].parity.tablet (media-paminklas-paprastas-1) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[0].parity.mobile (media-paminklas-paprastas-1) — mobile parity is pending; production requires equivalent or adapted.
- **ERROR · unknown-media-rights** — media[1] (media-paminklas-paprastas-2) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[1].parity.desktop (media-paminklas-paprastas-2) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[1].parity.tablet (media-paminklas-paprastas-2) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[1].parity.mobile (media-paminklas-paprastas-2) — mobile parity is pending; production requires equivalent or adapted.
- **ERROR · unknown-media-rights** — media[2] (media-paminklas-paprastas-3) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[2].parity.desktop (media-paminklas-paprastas-3) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[2].parity.tablet (media-paminklas-paprastas-3) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[2].parity.mobile (media-paminklas-paprastas-3) — mobile parity is pending; production requires equivalent or adapted.
- **ERROR · unknown-media-rights** — media[3] (media-paminklas-paprastas-4) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[3].parity.desktop (media-paminklas-paprastas-4) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[3].parity.tablet (media-paminklas-paprastas-4) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[3].parity.mobile (media-paminklas-paprastas-4) — mobile parity is pending; production requires equivalent or adapted.
- **ERROR · unknown-media-rights** — media[4] (media-paminklas-paprastas-5) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[4].parity.desktop (media-paminklas-paprastas-5) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[4].parity.tablet (media-paminklas-paprastas-5) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[4].parity.mobile (media-paminklas-paprastas-5) — mobile parity is pending; production requires equivalent or adapted.
- **ERROR · unknown-media-rights** — media[5] (media-paminklas-paprastas-6) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[5].parity.desktop (media-paminklas-paprastas-6) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[5].parity.tablet (media-paminklas-paprastas-6) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[5].parity.mobile (media-paminklas-paprastas-6) — mobile parity is pending; production requires equivalent or adapted.
- **ERROR · unknown-media-rights** — media[6] (media-paminklas-paprastas-7) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[6].parity.desktop (media-paminklas-paprastas-7) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[6].parity.tablet (media-paminklas-paprastas-7) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[6].parity.mobile (media-paminklas-paprastas-7) — mobile parity is pending; production requires equivalent or adapted.
- **ERROR · unknown-media-rights** — media[7] (media-paminklas-paprastas-8) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[7].parity.desktop (media-paminklas-paprastas-8) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[7].parity.tablet (media-paminklas-paprastas-8) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[7].parity.mobile (media-paminklas-paprastas-8) — mobile parity is pending; production requires equivalent or adapted.
- **ERROR · unknown-media-rights** — media[8] (media-paminklas-paprastas-9) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[8].parity.desktop (media-paminklas-paprastas-9) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[8].parity.tablet (media-paminklas-paprastas-9) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[8].parity.mobile (media-paminklas-paprastas-9) — mobile parity is pending; production requires equivalent or adapted.
- **ERROR · unknown-media-rights** — media[9] (media-paminklas-paprastas-10) — Published media rights are unknown.
- **ERROR · release-parity-incomplete** — media[9].parity.desktop (media-paminklas-paprastas-10) — desktop parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[9].parity.tablet (media-paminklas-paprastas-10) — tablet parity is pending; production requires equivalent or adapted.
- **ERROR · release-parity-incomplete** — media[9].parity.mobile (media-paminklas-paprastas-10) — mobile parity is pending; production requires equivalent or adapted.
- **717 additional issues are not expanded here; the totals above remain exact.**
