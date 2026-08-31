import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { GalleryLightbox } from "@/components/content/akmendarba/gallery-lightbox";
import { Reveal } from "@/components/reveal";
import type { AkmendarbaService } from "@/content/akmendarba";

export function ServiceDetail({ service }: { service: AkmendarbaService }) {
  const galleryItems = service.examples.map((src) => ({ src, alt: service.heroAlt }));

  return (
    <>
      <section className="ak-page-hero ak-page-hero--split" aria-labelledby="ak-page-title">
        <div className="content-shell ak-page-hero__breadcrumbs">
          <Link href="/">
            <ArrowLeft aria-hidden="true" size={15} strokeWidth={1.4} /> Pradžia
          </Link>
          <span>Produkcija</span>
        </div>
        <div className="page-shell ak-page-hero__grid">
          <Reveal className="ak-page-hero__copy">
            <p className="ak-kicker">{service.eyebrow}</p>
            <h1 id="ak-page-title">{service.title}</h1>
            <p>{service.summary}</p>
            <div className="ak-page-hero__actions">
              <Link className="ak-button ak-button--dark" href="/kontaktai">
                Susisiekti <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.4} />
              </Link>
              <Link className="ak-text-link" href={service.galleryHref}>
                {service.galleryLabel} <ArrowRight aria-hidden="true" size={16} strokeWidth={1.4} />
              </Link>
            </div>
          </Reveal>
          <Reveal className="ak-page-hero__media" delay={0.08}>
            <figure>
              <Image alt={service.heroAlt} fill priority sizes="(min-width: 64rem) 56vw, 100vw" src={service.heroImage} />
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="ak-service-copy ak-section" aria-labelledby="ak-service-copy-title">
        <div className="content-shell ak-service-copy__grid">
          <Reveal>
            <p className="ak-kicker">Akmendarba</p>
            <h2 id="ak-service-copy-title">{service.shortTitle}</h2>
          </Reveal>
          <div className="ak-service-copy__body">
            {service.paragraphs.map((paragraph, index) => (
              <Reveal delay={index * 0.07} key={paragraph}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ak-service-examples ak-section" aria-labelledby="ak-examples-title">
        <div className="content-shell">
          <Reveal className="ak-section-heading">
            <div>
              <p className="ak-kicker">Pavyzdžiai</p>
              <h2 id="ak-examples-title">Atlikti darbai.</h2>
            </div>
            <Link className="ak-text-link" href={service.galleryHref}>
              {service.galleryLabel} <ArrowRight aria-hidden="true" size={16} strokeWidth={1.4} />
            </Link>
          </Reveal>
          <GalleryLightbox className="ak-gallery--editorial" items={galleryItems} />
        </div>
      </section>

      <section className="ak-contact-cta ak-section" aria-labelledby="ak-service-contact-title">
        <div className="content-shell ak-contact-cta__grid">
          <Reveal>
            <p className="ak-kicker">Šiauliai · Visa Lietuva</p>
            <h2 id="ak-service-contact-title">Pasikalbėkime apie jūsų darbą.</h2>
          </Reveal>
          <Reveal className="ak-contact-cta__action" delay={0.1}>
            <p>Susisiekite telefonu arba el. paštu — kontaktus rasite vienoje vietoje.</p>
            <Link className="ak-button ak-button--light" href="/kontaktai">
              Kontaktai <ArrowRight aria-hidden="true" size={17} strokeWidth={1.4} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
