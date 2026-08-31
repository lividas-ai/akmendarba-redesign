# Function parity matrix

| Function ID | Source URL | Function | Inputs and outputs | Destination | Integration | Fixtures | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| `function-primary-navigation` | all pages | Desktop and mobile navigation | Two illustrated panels plus direct page links | site header | complete | header keyboard/pointer/mobile checks | adapted | Produkcija and Galerija are panels; Apie mus and Kontaktai are direct links |
| `function-gallery-navigation` | `/galerija/` and child galleries | Open category and gallery images | Category/link selection → target gallery/media | exact gallery paths | complete | gallery route and image checks | adapted | Preserves the four source gallery categories |
| `function-call` | `/kontaktai/` | Telephone link | Tap/click → `tel:+37067716667` | header/footer/contact | complete | href assertion | equivalent | No form or remote integration |
| `function-email` | `/kontaktai/` | Email link | Tap/click → `mailto:info@akmendarba.lt` | footer/contact | complete | href assertion | equivalent | No form or remote integration |
| `function-map` | `/kontaktai/` | Location map/link | Tap/click → public map query | location dialog/contact | complete | external href assertion | adapted | Uses the same public headquarters address |
| `function-facebook` | `/kontaktai/` | Facebook link | Tap/click → public profile | footer/contact | complete | external href assertion | equivalent | `facebook.com/akmendarba.granitas/` |
| `function-instagram` | `/kontaktai/` | Instagram link | Tap/click → public profile | footer/contact | complete | external href assertion | equivalent | `instagram.com/akmendarba/` |
| `function-cookie-consent` | `/` | Cookie information notice | Acknowledgement → local preference persistence | global | complete | `fixture-cookie-consent` | adapted | The notice stores only its own acknowledgement; analytics and third-party tracking are inactive |

## Confirmed absent from the source

The source has no public enquiry form, project planner, calculator, named material catalogue, product selector, search, saved-items function, booking flow, CRM hand-off or price list. Those Granit Decor template capabilities are intentionally disabled, not recreated with invented behavior.
