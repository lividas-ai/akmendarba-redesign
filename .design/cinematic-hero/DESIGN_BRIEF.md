# Cinematic homepage hero

## Goal

Replace the split-screen homepage hero with a full-bleed, showroom-style film that immediately demonstrates Granit Decor's craft. The hero should carry the same calm, image-first hierarchy as Salvatori's homepage while remaining clearly branded as Granit Decor.

## Visual direction

- Quiet Italian showroom precision: full-width architectural imagery, restrained typography, square controls, minimal ornament.
- The media fills the full first viewport behind the fixed two-tier header; no page-shell margins or empty copy column.
- White copy sits over the lower-left of the image with a measured dark gradient for legibility.
- A small project label and playback control sit in the lower-right, echoing editorial slideshow controls without copying Salvatori branding.

## Content hierarchy

1. Full kitchen and curved natural-stone island.
2. Short headline: “Akmens sprendimai jūsų erdvei.”
3. One concise supporting sentence.
4. Primary project CTA and secondary material CTA.
5. Quiet project/source label and pause/play control.

## Motion

- One continuous, stabilized clockwise orbit around the island.
- The entire island remains visible; the hidden kitchen wall is revealed using Granit Decor's matching reverse-angle photographs.
- Constant speed, fixed exposure and focal length, no cuts or morphing.
- Identical first and final composition for an invisible loop.
- Entrance animation is limited to a soft media reveal and short copy rise.
- `prefers-reduced-motion` renders the still poster and does not mount the autoplaying video.
- A visible pause/play button gives every visitor control of the ambient motion.

## Responsive behavior

- Desktop: hero is one full viewport high, including the area behind the fixed header; copy is bottom-left and project controls bottom-right.
- Tablet: preserve the full-bleed film and bottom overlay; reduce headline measure and keep controls clear of copy.
- Mobile: use a portrait-friendly crop of the same 16:9 film, shorter copy, stacked actions, and lift controls above the mobile action dock.

## Accessibility and performance

- Descriptive poster alt text is present as a real image layer.
- The decorative video is muted, has no audio track, and is hidden from assistive technology.
- Playback state is exposed through the pause/play button label.
- Poster is eager-loaded for LCP; video uses metadata preload and begins only when motion is allowed.
- Text maintains sufficient contrast over every frame through a multi-axis gradient veil.
