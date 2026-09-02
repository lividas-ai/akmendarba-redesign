# Function parity matrix

| Function ID | Source URL | Function | Inputs and outputs | Destination | Integration | Fixtures | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| `function-primary-navigation` | all pages | Desktop and mobile navigation | Two illustrated panels plus direct page links | site header | complete | header keyboard/pointer/mobile checks | adapted | Produkcija and Galerija are panels; Apie mus and Kontaktai are direct links |
| `function-gallery-navigation` | `/galerija/` and child galleries | Open category and gallery images | Category/link selection → target gallery/media | exact gallery paths | complete | gallery route and image checks | adapted | Preserves the four source gallery categories |
| `function-call` | `/kontaktai/` | Telephone link | Tap/click → `tel:+37067716667` | header/footer/contact | complete | href assertion | equivalent | Uses the source contact number |
| `function-email` | `/kontaktai/` | Email link | Tap/click → `mailto:info@akmendarba.lt` | footer/contact | complete | href assertion | equivalent | Uses the source email address |
| `function-map` | `/kontaktai/` | Location map/link | Tap/click → public map query | location dialog/contact | complete | external href assertion | adapted | Uses the same public headquarters address |
| `function-facebook` | `/kontaktai/` | Facebook link | Tap/click → public profile | footer/contact | complete | external href assertion | equivalent | `facebook.com/akmendarba.granitas/` |
| `function-instagram` | `/kontaktai/` | Instagram link | Tap/click → public profile | footer/contact | complete | external href assertion | equivalent | `instagram.com/akmendarba/` |
| `function-cookie-consent` | `/` | Cookie information notice | Acknowledgement → local preference persistence | global | complete | `fixture-cookie-consent` | adapted | The notice stores only its own acknowledgement; analytics and third-party tracking are inactive |
| `function-contact-enquiry` | client input, 2026-09-02 | Contact enquiry preparation | Validated details → local review summary | `/kontaktai/` | frontend-only | `fixture-contact-enquiry-local-preview` | client-approved addition | No POST, email or CRM delivery; the result explicitly says nothing was sent |
| `function-material-selector` | client input, 2026-09-02 plus publicly rendered homepage and gallery pages | Save and compare source-visible stone/work references | 137 visual references → local favourites and comparison of up to 3 items | `/akmuo/` and saved-items dialog | complete | `fixture-material-save`, `fixture-material-compare` | client-approved addition | Contains 131 unique gallery references (16 one-piece monuments, 64 multi-piece monuments, 27 grave-covering visuals, 19 accessories, 5 finishes) plus 6 distinct homepage stone/production/service-card visuals; entries are not named stock items and exact stone/availability must be confirmed |

## Confirmed absent from the source and still omitted

The source has no public enquiry form, project planner, calculator, named material catalogue, product selector, search, saved-items function, booking flow, CRM hand-off or price list. The form and the source-visible reference save-and-compare interface are restored only because the client explicitly requested them on 2026-09-02. The selector is built from the union of publicly rendered source images and does not turn gallery photographs into claims about named products, stock or availability. Project planning, calculators, named product data, search, booking, CRM hand-off and price lists remain omitted.
