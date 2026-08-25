import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import { ContactDemoForm } from "@/components/content/contact-demo-form";
import { EditorialHero } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Kontaktai",
  description:
    "Susisiekite su Granit Decor: +370 650 23784, stone@granitdecor.lt, Kęstučio g. 1, Lentvaris. Darbo laikas I–V 8:00–16:00.",
};

// VERIFY BEFORE LAUNCH: confirm phone, email, customer-facing address and opening hours with the client.
const contactDetails = [
  { label: "Telefonas", value: "+370 650 23784", href: "tel:+37065023784", Icon: Phone },
  { label: "El. paštas", value: "stone@granitdecor.lt", href: "mailto:stone@granitdecor.lt", Icon: Mail },
  {
    label: "Dirbtuvės",
    value: "Kęstučio g. 1, Lentvaris",
    href: "https://www.google.com/maps/search/?api=1&query=K%C4%99stu%C4%8Dio+g.+1%2C+Lentvaris",
    Icon: MapPin,
  },
  { label: "Darbo laikas", value: "I–V 8:00–16:00", href: null, Icon: Clock3 },
] as const;

export default function ContactPage() {
  return (
    <>
      <EditorialHero
        breadcrumbs={[{ label: "Kontaktai" }]}
        eyebrow="Kontaktai"
        folio="Lentvaris"
        tone="clay"
        title="Susisiekite dėl savo projekto."
        body="Paskambinkite, parašykite arba atsiųskite trumpą užklausą su gaminio tipu, apytikriais matmenimis ir turima vaizdine medžiaga."
      />

      <section className="contact-details section" aria-labelledby="contact-details-title">
        <div className="content-shell contact-details__grid">
          <Reveal className="contact-details__heading">
            <h2 id="contact-details-title">Telefonas, el. paštas ir dirbtuvės.</h2>
            <p>
              Prieš atvykdami susisiekite, kad galėtume skirti laiko jūsų projektui.
            </p>
          </Reveal>
          <address className="contact-details__list">
            {contactDetails.map(({ label, value, href, Icon }, index) => (
              <Reveal delay={index * 0.055} key={label}>
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
                    <Icon aria-hidden="true" size={21} strokeWidth={1.45} />
                    <span>
                      <small>{label}</small>
                      <strong>{value}</strong>
                    </span>
                    <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.45} />
                  </a>
                ) : (
                  <div>
                    <Icon aria-hidden="true" size={21} strokeWidth={1.45} />
                    <span>
                      <small>{label}</small>
                      <strong>{value}</strong>
                    </span>
                  </div>
                )}
              </Reveal>
            ))}
          </address>
        </div>
      </section>

      <section className="contact-form-section section section--inverse" aria-label="Užklausos forma">
        <div className="content-shell">
          <ContactDemoForm />
        </div>
      </section>

      <section className="contact-note section" aria-labelledby="contact-note-title">
        <div className="reading-shell">
          <Reveal>
            <h2 id="contact-note-title">Pradėkite nuo gaminio, ne nuo akmens pavadinimo.</h2>
            <p>
              Parašykite, ką norite pagaminti, ir pridėkite turimą eskizą, brėžinį ar nuotraukas. Patikusius akmens variantus galite išsaugoti projekto plane.
            </p>
            <Link className="text-link" href="/akmuo">
              Peržiūrėti akmens kolekciją <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
