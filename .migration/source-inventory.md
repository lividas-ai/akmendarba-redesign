# Source inventory

The authoritative page list was captured from the public WordPress Pages API on 2026-08-31. The public Media API returned 150 items; its full machine-readable capture is stored at `.migration/evidence/source-media.json`.

| Source ID | Approved URL or artifact | Type | Retrieved | Capture status | Checksum | Notes |
|---|---|---|---|---|---|---|
| `source-home` | `https://akmendarba.lt/` | URL | 2026-08-31 | captured | live capture | Homepage, four services, company method, header/footer contacts, cookie banner and 6 distinct stone/production/service-card visuals used as selectable references |
| `source-about` | `https://akmendarba.lt/apie-mus/` | URL | 2026-08-31 | captured | live capture | Company location, equipment and experience claims |
| `source-monuments` | `https://akmendarba.lt/paminklai/` | URL | 2026-08-31 | captured | live capture | Product text and representative gallery images |
| `source-grave-coverings` | `https://akmendarba.lt/kapo-dengimai/` | URL | 2026-08-31 | captured | live capture | Product text and representative gallery images |
| `source-accessories` | `https://akmendarba.lt/aksesuarai/` | URL | 2026-08-31 | captured | live capture | Product text and representative gallery images |
| `source-finishing` | `https://akmendarba.lt/apdaila/` | URL | 2026-08-31 | captured | live capture | Interior/exterior finishing text and images |
| `source-gallery` | `https://akmendarba.lt/galerija/` | URL | 2026-08-31 | captured | live capture | Gallery category index |
| `source-gallery-monuments` | `https://akmendarba.lt/galerija/paminklu-galerija/` | URL | 2026-08-31 | captured | live capture | 80 one-part and multi-part monument images |
| `source-gallery-grave-coverings` | `https://akmendarba.lt/galerija/kapo-dengimu-galerija/` | URL | 2026-08-31 | captured | live capture | 25 images displayed; 27 related source media files captured, including two not published in the page gallery |
| `source-gallery-accessories` | `https://akmendarba.lt/galerija/aksesuaru-galerija/` | URL | 2026-08-31 | captured | live capture | 19 accessory images |
| `source-gallery-finishing` | `https://akmendarba.lt/galerija/apdailos-galerija/` | URL | 2026-08-31 | captured | live capture | 5 marble/stone-finishing images |
| `source-contact` | `https://akmendarba.lt/kontaktai/` | URL | 2026-08-31 | captured | live capture | Addresses, people, phone, email, legal/bank data, map and social URLs |
| `source-cookies-lt` | `https://akmendarba.lt/slapukai/` | URL | 2026-08-31 | captured | live capture | Lithuanian cookie and browsing-data information |
| `source-cookie-policy` | `https://akmendarba.lt/cookie-policy/` | URL | 2026-08-31 | captured | live capture | Legacy English cookie policy |
| `source-client-enhancements-2026-09-02` | `codex-thread-2026-09-02-contact-form-stone-tools` | client input | 2026-09-02 | captured | conversation record | Client explicitly requested a contact form plus stone favourites and comparison |
| `source-client-complete-stone-selection-2026-09-02` | `codex-thread-2026-09-02-complete-akmendarba-stone-selector` | client input | 2026-09-02 | captured | conversation record | Client explicitly requested every publicly visible Akmendarba stone and finished-work reference in the selector |

The publicly rendered page union contains 131 unique gallery references: 16 one-piece monument images, 64 multi-piece monument images, 27 grave-covering visuals, 19 accessory images and 5 finishing images. The grave-covering union includes the 25 child-gallery items plus the publicly rendered `kapo-dengimas-5.jpg` and `kapu-dengimas-plokstemis.jpg`; unpublished `kapo-dengimas-18.jpg` is retained in the media evidence but excluded from the selector. Six additional distinct homepage stone, production and service-card visuals are included: `Karjeras-s.jpg`, `cava_bianco_carrara_2.jpg`, `10.jpg`, `paminklai.jpg`, `aksesuarai-kapams.jpg` and `Apdaila-naudojant-akmeni.jpg`. The resulting selector contains 137 source-visible references. Unattached `Granite-1.jpg` is not treated as currently source-visible.

No public posts, products, calculators, forms, downloads or additional page records were returned in the approved source-page scope. The additional `/akmuo/` interface and the form on `/kontaktai/` are traced to the 2026-09-02 client-input records above; they are not represented as source-site parity. The selector entries are visual references and finished-work examples, not named stock items; exact stone and availability must be confirmed directly with Akmendarba.
