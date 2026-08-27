import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { ContactDemoForm } from "@/components/content/contact-demo-form";
import { EditorialHero } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";
import { activeBrandConfig } from "@/client/brand";
import { activeContactConfig } from "@/client/contact";

function isPresent<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const contactDescription = [
  activeContactConfig.phone?.display,
  activeContactConfig.email?.display,
  activeContactConfig.address?.label,
  activeContactConfig.openingHours,
].filter(isPresent).join(", ");

export const metadata: Metadata = {
  title: "Kontaktai",
  description: `Susisiekite su ${activeBrandConfig.identity.name}${contactDescription ? `: ${contactDescription}` : ""}.`,
};

type ContactDetail = {
  label: string;
  value: string;
  href: string | null;
  Icon: LucideIcon;
};

const contactDetails: ContactDetail[] = [];

if (activeContactConfig.phone) {
  contactDetails.push({
    label: "Telefonas",
    value: activeContactConfig.phone.display,
    href: activeContactConfig.phone.href,
    Icon: Phone,
  });
}

if (activeContactConfig.email) {
  contactDetails.push({
    label: "El. paštas",
    value: activeContactConfig.email.display,
    href: activeContactConfig.email.href,
    Icon: Mail,
  });
}

if (activeContactConfig.address) {
  contactDetails.push({
    label: "Dirbtuvės",
    value: activeContactConfig.address.label,
    href: activeContactConfig.address.href,
    Icon: MapPin,
  });
}

if (activeContactConfig.openingHours) {
  contactDetails.push({
    label: "Darbo laikas",
    value: activeContactConfig.openingHours,
    href: null,
    Icon: Clock3,
  });
}

export default function ContactPage() {
  return (
    <>
      <EditorialHero
        breadcrumbs={[{ label: "Kontaktai" }]}
        eyebrow="Kontaktai"
        folio={activeContactConfig.location?.shortLabel}
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
