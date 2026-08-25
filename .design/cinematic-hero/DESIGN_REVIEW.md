# Cinematic homepage hero — final design review

## Verdict

**PASS for the client demo.** The homepage now uses a full-bleed, first-viewport architectural film and the same calm, image-led hierarchy established in the design brief. The result is clearly branded as Granit Decor and does not reuse Salvatori's name, logo, copy, or proprietary assets.

## What was verified

### Hero geometry

- Desktop 1920 × 1080: the 118 px two-tier header is followed by a 962 px edge-to-edge hero; the next section begins at exactly 1080 px.
- Desktop 1280 × 800: the 118 px header is followed by a 682 px edge-to-edge hero; the next section begins at exactly 800 px.
- Tablet 768 × 1024: the 76 px compact header is followed by a 948 px hero; the next section begins at exactly 1024 px.
- Mobile 375 × 812: the 76 px compact header is followed by a 736 px hero; the next section begins at exactly 812 px.
- Short landscape phone 667 × 375: the supporting body is removed, the title and CTA remain fully visible above the action dock, and the kitchen remains legible behind them.
- No horizontal overflow was detected at any tested width.

### Film and loop

- The selected Higgsfield MiniMax H3 film is 2560 × 1440, silent, and 15 seconds long.
- The camera performs a real orbit around the island, reveals the matching rear kitchen and dining area, and returns to the opening camera composition.
- Start, midpoint, late-loop and wrap frames were extracted and inspected before selection.
- Seedance 2.5 was rejected for a visible wrap jump, Kling 3.0 was rejected for insufficient camera movement, and FLUX 3 failed generation.
- The poster is the exact opening frame of the selected film, so poster-to-playback transition does not reframe the room.

### Responsive playback

- Desktop loads the 2560 × 1440 film.
- Tablet and mobile load the 1280 × 720 reduced-bandwidth version.
- In all live checks the video reached ready state 4, autoplayed muted and inline, and advanced normally.
- Pause stopped time advancement completely; resume restarted it.
- The local production server returned `206 Partial Content`, `Accept-Ranges: bytes`, the correct byte range, and `video/mp4` content type.
- Visitors who request reduced motion receive the still poster because the video element is not mounted.

### Header and navigation

- The desktop header keeps the reference's two quiet horizontal tiers, opaque white background, centered wordmark, restrained utilities, and evenly distributed navigation.
- All six desktop navigation triggers are present: Gaminiai, Akmuo, Projektai, Kaip dirbame, Profesionalams, and Apie mus.
- Every navigation trigger opens a full-width image-led mega menu and remains selectable after click.
- Gaminiai exposes eight visual categories; Akmuo and Projektai expose five; the remaining sections expose three concise visual entry points plus supporting links.
- At 2560 × 1440 the menu inner frame remains a centered 1440 px showroom grid with no horizontal overflow or clipped tiles.
- The route scroll reset remains active, so a newly selected page opens at its top unless an intentional anchor is present.

### Homepage rhythm

- The redundant text-only introduction directly below the hero was removed.
- The hero now flows immediately into the product mosaic, followed by material, project, process, professional, and enquiry sections.
- Product and project photography is aligned to a consistent grid without the previous oversized gaps.
- The process section uses a balanced split layout rather than a mostly empty canvas.
- Browser console review returned no errors or warnings.

## Evidence

- `screenshots/final-home-1920x1080.png`
- `screenshots/final-home-desktop-1280x800.png`
- `screenshots/final-home-tablet-768x1024.png`
- `screenshots/final-home-mobile-375x812.png`
- `screenshots/final-home-landscape-phone-667x375.png`
- `screenshots/final-mega-menu-ultrawide-2560x1440.png`
- `screenshots/final-home-products-1280x800.png`
- `screenshots/final-home-materials-1280x800.png`
- `screenshots/final-home-projects-1280x800.png`
- `screenshots/final-home-process-1280x800.png`

## Launch condition

The interface is ready for client demonstration. Before public release, Granit Decor should approve the AI-assisted visualization and confirm reuse rights for the underlying project photography. The film should be described internally as a visualization, not documentary footage. The current 2K and 720p files deliberately prioritize local-demo image quality; public hosting should add CDN/adaptive delivery or additional optimized encodes without replacing the high-quality masters.
