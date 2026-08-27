# Premium business template operating contract

This repository is the golden master for producing a separate website repository for each client. It is not a multi-tenant CMS and it is not edited in place for live clients.

## Per-client workflow

1. Create a new repository from this golden master.
2. Record the client's approved domains, files, interviews, and credentials as source records.
3. Crawl and inventory every public source URL, downloadable file, form, filter, calculator, selector, configurator, and authenticated dependency visible to users.
4. Build the source parity matrix before designing new pages.
5. Replace the reference client package and all client-owned assets.
6. Preserve locked template files, including the current hero film, unless the lock is explicitly changed. The film stays visible as the first home viewport even when its kitchen setting does not match the client's niche. It is template atmosphere, not evidence of client work, and client claims must not be attached to it.
7. Render only verified, published pages and blocks. Delete unsupported template sections.
8. Rebuild source functions through the registered function layer and test them against evidence-backed fixtures.
9. Run automated validation, build checks, and desktop/tablet/mobile browser QA.
10. Review the parity matrix and blocked dependencies with the client before publishing.

## Completion definition

A client migration is not complete because the homepage looks finished. It is complete when:

- every approved source URL has been reviewed;
- every visible source content item is mapped to a new destination or an approved exclusion;
- every source function has been tested in the new design or explicitly blocked;
- every published media asset has provenance and rights status;
- every internal route resolves and every published page is reachable;
- desktop, tablet, and mobile parity is approved;
- the production build and browser QA pass.

## Protected asset policy

`template.lock.json` is machine-readable. Files listed under `lockedPaths` must not be overwritten by an automated client import. The current 360-degree hero video and posters are locked because generation was expensive. They may be replaced later only through a deliberate template-level decision.

The committed `template.lock.snapshot.json` is the golden-master checksum baseline. It covers the lock contract, schema, checker, hero files, playback component, and protected design system. Client work may verify this baseline but may not regenerate it.

The same lock file separates three kinds of files:

- `lockedPaths` are the reusable visual and validation engine;
- `replaceableRoots` contain client facts, media, branding, and provenance;
- `clientGeneratedPaths` are explicit route adapters and verified client-specific functions that Codex may regenerate only after the source inventory and parity map exist.

Client-generated routes are not treated as template facts. A new client can have fewer, more, or differently named pages. The root layout, evidence schema, validation gates, responsive design system, and locked film remain protected.

## Honest rendering policy

The template never fills content gaps with plausible marketing copy. Interface labels such as “Menu”, “Back”, and “Search” may be template-owned. Business facts, claims, offers, and descriptions require source or client evidence. Missing verified content removes the section.
