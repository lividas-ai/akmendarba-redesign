import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "@/styles/content-pages.css";
import { CookieNotice } from "@/components/content/akmendarba/cookie-notice";
import { AkmendarbaHeroFilm } from "@/components/content/akmendarba/hero-film";
import { Reveal } from "@/components/reveal";
import {
  akmendarbaServices,
  homeGalleryPreview,
  homeIntroduction,
  manufacturingParagraphs,
} from "@/content/akmendarba";

export default function HomePage() {
  return (
    <>
      <AkmendarbaHeroFilm />

      <section className="ak-intro ak-section" aria-labelledby="ak-intro-title">
        <div className="content-shell ak-intro__grid">
          <Reveal>
            <p className="ak-kicker">Natūralus akmuo</p>
            <h2 id="ak-intro-title">Medžiaga, kuri išlieka.</h2>
          </Reveal>
          <Reveal className="ak-intro__body" delay={0.08}>
            <p>{homeIntroduction}</p>
            <Link className="ak-text-link" href="/apie-mus">
              Apie Akmendarba <ArrowRight aria-hidden="true" size={16} strokeWidth={1.4} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="ak-services ak-section" id="paslaugos" aria-labelledby="ak-services-title">
        <div className="content-shell">
          <Reveal className="ak-section-heading">
            <div>
              <p className="ak-kicker">Produkcija</p>
              <h2 id="ak-services-title">Ką gaminame.</h2>
            </div>
            <Link className="ak-text-link" href="/galerija">
              Visa galerija <ArrowRight aria-hidden="true" size={16} strokeWidth={1.4} />
            </Link>
          </Reveal>

          <div className="ak-service-grid">
            {akmendarbaServices.map((service, index) => (
              <Reveal className="ak-service-grid__item" delay={(index % 2) * 0.08} key={service.slug}>
                <Link className="ak-service-card" href={`/${service.slug}`}>
                  <figure>
                    <Image
                      alt={service.heroAlt}
                      fill
                      sizes="(min-width: 64rem) 50vw, 100vw"
                      src={service.cardImage}
                    />
                  </figure>
                  <div>
                    <h3>{service.shortTitle}</h3>
                    <ArrowUpRight aria-hidden="true" size={21} strokeWidth={1.35} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ak-making ak-section ak-section--dark" aria-labelledby="ak-making-title">
        <div className="page-shell ak-making__media">
          <Reveal>
            <figure>
              <Image
                alt="Granito plokštės pjovimas Akmendarba gamyboje"
                fill
                sizes="(min-width: 64rem) 52vw, 100vw"
                src="/client/akmendarba/source/10.jpg"
              />
            </figure>
          </Reveal>
        </div>
        <div className="content-shell ak-making__content">
          <Reveal>
            <p className="ak-kicker">Gaminame patys</p>
            <h2 id="ak-making-title">Nuo granito bloko iki sumontuoto gaminio.</h2>
          </Reveal>
          <div className="ak-making__copy">
            {manufacturingParagraphs.map((paragraph, index) => (
              <Reveal delay={index * 0.07} key={paragraph}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ak-work ak-section" aria-labelledby="ak-work-title">
        <div className="content-shell">
          <Reveal className="ak-section-heading">
            <div>
              <p className="ak-kicker">Atlikti darbai</p>
              <h2 id="ak-work-title">Darbų galerija.</h2>
            </div>
            <Link className="ak-button ak-button--outline" href="/galerija">
              Peržiūrėti galeriją <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.4} />
            </Link>
          </Reveal>
        </div>

        <div className="page-shell ak-work__rail">
          {homeGalleryPreview.map((item, index) => (
            <Reveal className="ak-work__item" delay={index * 0.06} key={item.src}>
              <Link href="/galerija" aria-label="Atverti darbų galeriją">
                <Image alt={item.alt} fill sizes="(min-width: 64rem) 28vw, 76vw" src={item.src} />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="ak-contact-cta ak-section" aria-labelledby="ak-contact-title">
        <div className="content-shell ak-contact-cta__grid">
          <Reveal>
            <p className="ak-kicker">Šiauliai · Visa Lietuva</p>
            <h2 id="ak-contact-title">Aptarkime jūsų darbą.</h2>
          </Reveal>
          <Reveal className="ak-contact-cta__action" delay={0.1}>
            <p>Susisiekite dėl paminklo, kapo dengimo, akmens aksesuarų ar apdailos.</p>
            <Link className="ak-button ak-button--light" href="/kontaktai">
              Kontaktai <ArrowRight aria-hidden="true" size={17} strokeWidth={1.4} />
            </Link>
          </Reveal>
        </div>
      </section>
      <CookieNotice />
    </>
  );
}
