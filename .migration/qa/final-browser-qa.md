# Final browser QA

- Site: `akmendarba`
- Base URL: `http://127.0.0.1:4444`
- Date: `2026-09-02`
- Browser: Chromium / Google Chrome
- Script-reported checks: **239 passed, 0 failed**
- Production and static builds: **PASS**
- Template lock: **PASS** — 31 locked paths, 34 files

## Coverage

### Whole-site route smoke test

`tests/route-smoke.mjs` completed **130 checks** across desktop (`1440 × 900`) and mobile (`390 × 844`). All 15 public routes returned HTTP 200, exposed a visible non-empty H1, and had no horizontal document overflow. The home hero video was also verified as muted, autoplaying, looping, inline, and actively advancing on both viewports.

Routes checked:

- `/`
- `/apie-mus/`
- `/paminklai/`
- `/kapo-dengimai/`
- `/aksesuarai/`
- `/apdaila/`
- `/akmuo/`
- `/galerija/`
- `/galerija/paminklu-galerija/`
- `/galerija/kapo-dengimu-galerija/`
- `/galerija/aksesuaru-galerija/`
- `/galerija/apdailos-galerija/`
- `/kontaktai/`
- `/slapukai/`
- `/cookie-policy/`

### Contact form

`tests/contact-form.mjs` completed **76 checks** at `1280`, `768`, `390`, and `320` pixel widths.

- Required-name validation passes.
- At least one contact method (phone or email) is required and validated.
- All four source-backed service categories are available.
- Stone selections passed through `?akmenys=` are displayed.
- A valid enquiry produces a local review summary, copy action, and prefilled email action.
- The demo explicitly states that it does not send or store the submission.
- No local POST request is made.
- No browser errors or horizontal overflow were detected.

### Stone selection, favourites, and comparison

`tests/material-selection.mjs` completed **33 checks** at `1440`, `768`, `390`, and `320` pixel widths.

- Only the two material families evidenced by the source website are shown: granite and marble.
- Favourites persist in local storage and appear in the header saved-items dialog.
- Comparison selections persist in local storage and survive reload.
- The comparison view can pass selected materials into the contact form.
- Quick view, keyboard-accessible dialogs, direct mobile navigation, and responsive layouts pass.
- No browser errors, failed local responses, or horizontal overflow were detected.

## Build verification

`CI=true pnpm check` passed in full: template lock, TypeScript, ESLint, lock tests, manifest tests, production build, and static-export build.

The draft manifest passes. Formal release readiness remains blocked by the migration ledger’s existing unresolved media-rights and source-parity approvals, plus the intentionally frontend-only contact delivery integration. Those blockers are documented and were not disguised as complete.

## Evidence captures

- `home-desktop.png`
- `home-mobile.png`
- `contact-form-desktop.png`
- `contact-form-mobile.png`
- `material-selection-desktop.png`
- `material-selection-mobile.png`
