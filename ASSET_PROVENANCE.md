# Asset provenance and launch rights checklist

The demo uses media currently published on `granitdecor.lt`. Public availability is evidence of source, not proof that Granit Decor owns unrestricted reuse rights. Confirm photographer, designer, homeowner, supplier, and/or agency permissions before public launch.

## Brand asset

- Raster logo source: `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/Granit-Decor-Logotipas-02.png`
- Local file: `public/assets/brand/granit-decor-logo.png`
- Limitation: 300 × 326 raster only. Do not enlarge; commission or approve a vector master.

## Project imagery

The complete public portfolio mirror lives in `public/assets/portfolio/`. Its 118 optimized WebP files, nine gallery categories, local slugs, captions, and exact source URLs are recorded in `src/data/portfolio-gallery.ts`. The smaller curated set below is also used for editorial page heroes and project-detail demonstrations.

| Local stem | Published source |
| --- | --- |
| `hero-atelier` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_25-1920w.jpg` |
| `bathroom-light` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_30-1920w.jpg` |
| `kitchen-warm` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_03-1920w.jpg` |
| `kitchen-wide` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_05-1920w.jpg` |
| `kitchen-black-detail` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_13-1920w.jpg` |
| `kitchen-black-island` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_16-1920w.jpg` |
| `bathroom-black` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_29-1920w.jpg` |
| `counter-curved` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_24-1920w.jpg` |
| `bathroom-detail` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_31-1920w.jpg` |
| `wall-detail` | `https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/opt/granit-decor-darbai_28-1920w.jpg` |

No image is assigned an unverified project name, location, stone, date, collaborator, or result claim.

## AI-assisted homepage film

The homepage hero is an explicitly AI-assisted visualization of the same photographed Granit Decor kitchen. It must be reviewed and approved by Granit Decor before public use; it must not be presented as documentary footage.

- Spatial references: published project photographs `granit-decor-darbai_24.jpg` through `granit-decor-darbai_27.jpg`.
- Wide master-frame generator: Higgsfield Nano Banana 2.
- Selected master-frame job: `d8313ec0-7415-47be-a198-dfeb035c76f4`.
- Local poster: `public/assets/video/granit-decor-kitchen-orbit-poster.webp`.
- Selected motion generator: Higgsfield MiniMax H3, 2K, silent, 15 seconds.
- Selected motion job: `6ef23a61-b063-4be7-9ed2-8727d99ba31e`.
- Motion direction: a constant-speed clockwise architectural orbit around the island, using the same master frame as the start and end keyframe.
- Archived landscape master: `public/assets/video/granit-decor-kitchen-orbit-v1-landscape.mp4`, 2560 × 1440.
- Archived reduced-resolution export: `public/assets/video/granit-decor-kitchen-orbit-v1-mobile.mp4`, 1280 × 720.
- Portrait motion generator: Higgsfield FLUX 3 Video, silent, 15 seconds.
- Portrait motion job: `6c7aa086-6725-45ee-946d-bd5edde930da`.
- Portrait source master: 1088 × 1920, 24 fps, with the island retained as the orbit's visual anchor.
- Production desktop delivery: `public/assets/video/granit-decor-kitchen-orbit-v2-desktop-2560.mp4`, 2560 × 1440, 24 fps, silent, network-optimized MP4.
- Rejected portrait delivery: `public/assets/video/granit-decor-kitchen-orbit-v2-mobile-portrait.mp4`, 1088 × 1920. This independent generation did not reproduce the approved desktop orbit and is retained only as an archive.
- Production portrait delivery: `public/assets/video/granit-decor-kitchen-orbit-v3-mobile-parity-810x1440.mp4`, 810 × 1440, 24 fps, silent, fast-start MP4. It is a deterministic centered reframe of the approved desktop delivery, so every frame, camera angle, speed, and loop point matches desktop.
- Production portrait poster: `public/assets/video/granit-decor-kitchen-orbit-v3-mobile-parity-poster.webp`, 810 × 1440, extracted from the first frame of the same delivery.
- Review record: Seedance 2.5 job `69bb1ad8-32cf-40fd-afe0-3a996e8c31a2` was rejected for a visible loop jump; FLUX 3 job `dccb0f9e-6112-47e6-a70c-b896f5467d3b` failed; Kling 3.0 job `9a8516a5-c667-4afb-97e6-ba8e6bc72d36` was rejected because the camera remained effectively static.

The generated scene preserves the photographed island, blue stone wall, cabinetry, dining and living areas, but the wide master composition contains generative reconstruction. Keep the original wide project photograph (`counter-curved.webp`) as the social-sharing image.

## Material swatches

All 133 source and optimized URLs are recorded beside their exact public names in `src/data/materials.ts`. Local assets live in `public/assets/materials/`.

Important limitations:

- Supplier licensing and current offer/stock must be confirmed.
- A catalog swatch is representative; natural slabs vary.
- Thirteen records carry confirmation notes for ambiguous or likely misspelled public data.
- The two Breccia/Gris records with conflicting caption/category/filename data must not be promoted until corrected.

## Publication sign-off

Record approval per asset or asset group with: approver, date, permitted channels/territory, credit requirement, expiry, and any takedown condition.
