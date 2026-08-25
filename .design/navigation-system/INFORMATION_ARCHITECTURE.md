# Granit Decor navigation system

## Experience goal

Turn the global navigation into a visual project-discovery tool. A visitor should be able to reach a product, stone family, representative project, process detail, professional collaboration information, or company information in no more than two decisions.

The visual direction is quiet Italian-showroom precision adapted to Granit Decor: a flat white canvas, exact 3:4 imagery, restrained type, direct labels, and no decorative card chrome. Salvatori is the interaction and layout reference; Granit Decor retains its own logo, imagery, Lithuanian copy, services, and destinations.

## Primary users and top tasks

- Homeowner: find a suitable product, browse stone, understand the process, then start a project.
- Architect or interior designer: inspect capabilities, representative work, material range, and collaboration details.
- Returning visitor: retrieve saved stones or continue to the project brief.

The primary navigation must optimize for product discovery and project planning. Editorial content, memorial work, legal information, and contact details remain visible but secondary.

## Global hierarchy

```text
Pradžia
├── Gaminiai
│   ├── 13 application pages
│   └── Aptarti projektą
├── Akmuo
│   ├── Granitas
│   ├── Marmuras
│   ├── Kvarcitas
│   ├── Oniksas
│   ├── Travertinas
│   └── Išsaugoti akmenys
├── Projektai
│   ├── Visi atlikti darbai
│   └── 9 teminės atliktų darbų kolekcijos
├── Kaip dirbame
│   ├── Kaip dirbame
│   └── Parengti projekto planą
├── Profesionalams → /profesionalams
├── Apie mus → /apie-mus
└── Utilities
    ├── Search
    ├── Išsaugoti akmenys
    ├── Kontaktai
    └── Aptarti projektą
```

## Desktop navigation behavior

- Gaminiai, Akmuo, Projektai, and Kaip dirbame are buttons with purpose-built panels. Profesionalams and Apie mus are direct first-level links and never open a panel.
- Pointer hover opens one of the four available panels for efficient desktop use; click pins it so the user can move deliberately through links.
- A second trigger switches panels; the active trigger receives a one-pixel underline.
- Pointer movement between trigger and panel must not collapse the menu.
- Escape, the centered collapse control, or the page scrim closes the active layer.
- Visual discovery panels use the same 3:4 tile component, with five or eight tiles according to content count. The Kaip dirbame panel is text-only and never reserves an empty image grid.
- The right rail contains direct text actions. Its first link is always the corresponding section overview.
- Only real, existing routes are linked. No invented download center, showroom, team, client, or category pages.

## Mobile navigation behavior

- The 68px mobile header exposes Menu, the centered Granit Decor mark, Search, and saved-stone count.
- Menu opens a full-height white sheet with six 44px primary rows: four submenu buttons and two direct links.
- Selecting one of the four submenu rows slides to a text-only second level. Profesionalams and Apie mus navigate immediately without creating submenu state.
- The second level includes Back, the section title, Close, destination rows, then bold secondary actions.
- All links are at least 44px high and return focus or close the dialog correctly.
- Search is a dedicated full-screen layer with grouped live results.

## Mega-panel map

### Gaminiai

Eight pictured destinations: Virtuvės stalviršiai, Vonios stalviršiai, Židinių apdaila, Sienų apdaila, Grindų danga, Laiptai ir pakopos, Akmens palangės, Kolonos.

Right rail: Visi gaminiai; Akmens stalai; Vidaus baldai; Lauko baldai; Fasadų apdaila; Antkapiai ir paminklai; Aptarti projektą.

### Akmuo

Five pictured destinations: Granitas, Marmuras, Kvarcitas, Oniksas, Travertinas.

Right rail: Visa akmens kolekcija; Išsaugoti akmenys; Kiti užsakomi paviršiai; Gaminiai; Aptarti medžiagos pasirinkimą.

### Projektai

Five representative project-detail destinations selected from the existing archive.

Right rail: Visi atlikti darbai; Darbai pagal erdvę; Gaminiai; Akmens kolekcija; Aptarti panašų projektą.

Kiekvienas teminės kolekcijos puslapis prasideda patikrintu pirminiu archyvo vaizdu, po kurio pateikiami dar 7–8 unikalūs vaizdai dviejuose aiškiai pavadintuose vizualiniuose skyriuose. Puslapyje aiškiai nurodoma, kad tai skirtingi „Granit Decor“ atlikti darbai, atrinkti pagal bendrą erdvės ar akmens sprendimo kryptį — jie nepristatomi kaip vienas fizinis projektas. Vaizdus galima atidaryti didesnei peržiūrai. Kitų darbų reklaminės kortelės ir pasikartojantys projekto mygtukai nekartojami; puslapis užbaigiamas vienu projekto planavimo veiksmu.

### Kaip dirbame

Two plain destinations only: Kaip dirbame (`/kaip-dirbame`) explains the full client process; Parengti projekto planą (`/projektas`) is the visually distinct planning action. No images or duplicate destinations appear in this panel.

### Profesionalams

Direct first-level link to Profesionalams (`/profesionalams`). It has no panel, image, submenu state, page scrim, or duplicate destination on desktop or mobile.

### Apie mus

Direct first-level link to Apie mus (`/apie-mus`). It has no panel, image, submenu state, page scrim, or duplicate destination on desktop or mobile.

## Search architecture

The header search is a navigation aid, not a second catalogue application. It indexes:

- all product/application pages;
- all natural-stone records and stone-family overview links;
- primary pages and utilities;
- representative projects and journal entries.

Results are grouped by type and limited in the initial view. The query matches Lithuanian labels, known keywords, and stone names. An empty query presents common starting points rather than an empty screen.

## URL and scroll rules

- Preserve the current static route structure.
- Query-based stone filters remain `/akmuo?tipas=...` and saved state remains `/akmuo?rodyti=issaugoti`.
- Cross-page section links use existing element IDs only.
- Route changes without fragments always begin at the top.
- Route changes with a valid fragment scroll to that section after rendering; they must not be overridden by the global top reset.

## Responsive and accessibility contract

- Desktop mega navigation begins at 70rem, matching the current header breakpoint.
- Tablet and mobile use the drill-down dialog; no horizontally clipped desktop panel.
- Dialogs lock body scrolling, close on Escape, preserve visible focus, and expose expanded state and controlled panel IDs.
- Search status is announced to assistive technology.
- Motion is transform/opacity based and reduced to near-zero under `prefers-reduced-motion`.

## Success criteria

- Four primary buttons open useful submenus; Profesionalams and Apie mus are direct first-level links on desktop and mobile.
- Every submenu destination resolves to an existing page or valid existing fragment.
- Search finds services, stones, and primary content without a page reload.
- Hover transfer, click pinning, outside dismissal, Escape, Back, and Close all work.
- No menu disappears while the pointer travels from its trigger into the panel.
- The same information architecture is generated from one typed data source on desktop and mobile.
