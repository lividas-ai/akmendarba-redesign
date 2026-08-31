import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { aboutParagraphs } from "@/content/akmendarba";

export const metadata: Metadata = {
  title: "Apie mus",
  description: "Akmendarba akmens apdirbimo gamyba Einoraičių kaime, netoli Šiaulių.",
};

export default function AboutPage() {
  return (
    <>
      <section className="ak-page-hero ak-page-hero--split ak-about-hero" aria-labelledby="ak-about-title">
        <div className="content-shell ak-page-hero__breadcrumbs">
          <Link href="/"><ArrowLeft aria-hidden="true" size={15} strokeWidth={1.4} /> Pradžia</Link>
        </div>
        <div className="page-shell ak-page-hero__grid">
          <Reveal className="ak-page-hero__copy">
            <p className="ak-kicker">Apie Akmendarba</p>
            <h1 id="ak-about-title">Akmenį apdirbame netoli Šiaulių.</h1>
            <p>Einoraičių kaime įsikūrusioje gamyboje dirbame su granito blokais, plokštėmis ir marmuro gaminiais.</p>
          </Reveal>
          <Reveal className="ak-page-hero__media" delay={0.08}>
            <figure>
              <Image
                alt="Akmendarba gamybinis pastatas Einoraičių kaime"
                fill
                priority
                sizes="(min-width: 64rem) 56vw, 100vw"
                src="/client/akmendarba/source/pastatas-2.jpg"
              />
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="ak-about-copy ak-section" aria-labelledby="ak-about-copy-title">
        <div className="content-shell ak-about-copy__grid">
          <Reveal>
            <p className="ak-kicker">Patirtis ir gamyba</p>
            <h2 id="ak-about-copy-title">Akmuo, technologijos ir meistrystė.</h2>
          </Reveal>
          <div className="ak-about-copy__body">
            {aboutParagraphs.map((paragraph, index) => (
              <Reveal delay={index * 0.07} key={paragraph}><p>{paragraph}</p></Reveal>
            ))}
          </div>
        </div>
        <div className="content-shell ak-about-facts" aria-label="Akmendarba faktai">
          <Reveal><strong>Daugiau kaip 20</strong><span>akmens apdirbimo staklių</span></Reveal>
          <Reveal delay={0.08}><strong>3 km</strong><span>nuo Šiaulių</span></Reveal>
        </div>
      </section>

      <section className="ak-contact-cta ak-section" aria-labelledby="ak-about-contact-title">
        <div className="content-shell ak-contact-cta__grid">
          <Reveal><p className="ak-kicker">Kontaktai</p><h2 id="ak-about-contact-title">Raskite mus Einoraičiuose.</h2></Reveal>
          <Reveal className="ak-contact-cta__action" delay={0.1}>
            <p>Saulėtekio g. 47, Einoraičių kaimas, Šiaulių rajonas.</p>
            <Link className="ak-button ak-button--light" href="/kontaktai">Visi kontaktai <ArrowRight aria-hidden="true" size={17} strokeWidth={1.4} /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
