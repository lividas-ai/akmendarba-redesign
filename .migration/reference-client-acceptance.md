# Site manifest acceptance report

- Site ID: `granit-decor`
- Schema version: `1.0.0`
- Validation mode: `draft`
- Current-mode acceptance: **PASS**
- Release readiness: **BLOCKED**

## Exact inventory

| Entity | Count |
| --- | --- |
| Pages | 170 |
| Media assets | 253 |
| Media variants | 254 |
| Functions | 2 |
| Sources | 272 |
| Source coverage records | 272 |
| Evidence references | 1197 |

- Pages by publication: published: 170
- Pages by kind: contact: 1, custom: 4, detail: 157, home: 1, index: 4, legal: 2, utility: 1
- Media by kind: image: 251, logo: 1, video: 1
- Media rights: unknown: 253
- Functions by type: form: 1, selector: 1
- Functions by integration: complete: 1, frontend-only: 1
- Sources by kind: client-input: 1, url: 271
- URL source status: captured: 256, partial: 15
- Coverage status: adapted: 272
- Coverage destinations: 428
- Unique evidence sources referenced: 268

## Parity

| Entity | Device | Total | Equivalent | Adapted | Intentional omit | Pending | Failed | Blocked |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| page | desktop | 170 | 170 | 0 | 0 | 0 | 0 | 0 |
| page | tablet | 170 | 0 | 170 | 0 | 0 | 0 | 0 |
| page | mobile | 170 | 0 | 170 | 0 | 0 | 0 | 0 |
| media | desktop | 253 | 253 | 0 | 0 | 0 | 0 | 0 |
| media | tablet | 253 | 0 | 253 | 0 | 0 | 0 | 0 |
| media | mobile | 253 | 0 | 253 | 0 | 0 | 0 | 0 |
| function | desktop | 2 | 2 | 0 | 0 | 0 | 0 | 0 |
| function | tablet | 2 | 0 | 2 | 0 | 0 | 0 | 0 |
| function | mobile | 2 | 0 | 2 | 0 | 0 | 0 | 0 |
| block | desktop | 172 | 172 | 0 | 0 | 0 | 0 | 0 |
| block | tablet | 172 | 0 | 172 | 0 | 0 | 0 | 0 |
| block | mobile | 172 | 0 | 172 | 0 | 0 | 0 | 0 |

Release-active unresolved parity checks: **0**

## Local media

- Local variants: 254
- External variants: 0
- Invalid variants: 0
- Existing local variants: 254
- Missing local variants: 0
- Unique existing local files: 254
- Unique local file bytes: 55868844 (53.28 MiB)

## Current-mode validation

- Total: 1
- By severity: warning: 1
- By category: function: 1
- By code: incomplete-published-function: 1

- **WARNING · incomplete-published-function** — functions[1] (function-project-planner) — Published function function-project-planner is frontend-only.

## Release blockers

- Total: 254
- By category: function: 1, rights: 253
- By code: incomplete-published-function: 1, unknown-media-rights: 253

- **ERROR · unknown-media-rights** — media[0] (media-logo) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[1] (media-hero-film) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[2] (media-material-verde-guatemala) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[3] (media-material-thassos-white) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[4] (media-material-statuario) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[5] (media-material-statuario-extra) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[6] (media-material-spider-black) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[7] (media-material-sivec) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[8] (media-material-silver-waterfall) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[9] (media-material-rosa-portogallo) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[10] (media-material-serres-white) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[11] (media-material-rosso-verona) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[12] (media-material-rain-forest-yellow) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[13] (media-material-rojo-alicante) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[14] (media-material-rain-forest-green) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[15] (media-material-rain-forest-brown) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[16] (media-material-portoro-oro) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[17] (media-material-calacatta-berrini) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[18] (media-material-grigio-piemonte) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[19] (media-material-pietra-grey) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[20] (media-material-nero-tunezi) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[21] (media-material-nero-marquina) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[22] (media-material-grigio-verace) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[23] (media-material-emperador-light) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[24] (media-material-diamond-oniciata) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[25] (media-material-crema-veneziana) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[26] (media-material-emperador-dark) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[27] (media-material-diamond-venatino) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[28] (media-material-calacatta-paonazzo) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[29] (media-material-crema-marfil) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[30] (media-material-breccia-sarda-nuvolato) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[31] (media-material-calacatta) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[32] (media-material-calacatta-extra) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[33] (media-material-caffee-latte) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[34] (media-material-breccia-sarda-venato) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[35] (media-material-gris-parga-marmuras-source-conflict) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[36] (media-material-gris-iberico-marmuras-source-conflict) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[37] (media-material-bianco-statuarietto) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[38] (media-material-botticino-semiclassico) — Published media rights are unknown.
- **ERROR · unknown-media-rights** — media[39] (media-material-blue-shadow) — Published media rights are unknown.
- **214 additional issues are not expanded here; the totals above remain exact.**
