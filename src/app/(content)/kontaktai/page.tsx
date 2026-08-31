import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Kontaktai",
  description: "Akmendarba kontaktai, gamybos adresas Einoraičiuose ir paminklų pardavimo aikštelė Šiauliuose.",
};

export default function ContactPage() {
  return (
    <>
      <section className="ak-index-hero ak-index-hero--contact" aria-labelledby="ak-contact-page-title">
        <div className="content-shell ak-index-hero__inner">
          <Link className="ak-back-link" href="/"><ArrowLeft aria-hidden="true" size={15} strokeWidth={1.4} /> Pradžia</Link>
          <Reveal>
            <p className="ak-kicker">Susisiekite</p>
            <h1 id="ak-contact-page-title">Kontaktai.</h1>
          </Reveal>
        </div>
      </section>

      <section className="ak-contact-page ak-section" aria-label="Akmendarba kontaktinė informacija">
        <div className="content-shell ak-contact-page__grid">
          <div className="ak-contact-page__primary">
            <Reveal className="ak-contact-block">
              <p className="ak-kicker">Informacija ir užsakymai</p>
              <a className="ak-contact-block__lead" href="tel:+37067716667">+370 677 16667 <Phone aria-hidden="true" size={22} strokeWidth={1.3} /></a>
              <a className="ak-contact-block__lead" href="mailto:info@akmendarba.lt">info@akmendarba.lt <Mail aria-hidden="true" size={22} strokeWidth={1.3} /></a>
            </Reveal>

            <Reveal className="ak-contact-block" delay={0.07}>
              <p className="ak-kicker">Atsakingi asmenys</p>
              <div className="ak-person">
                <div><strong>Sigitas Karlinskas</strong><span>Direktorius</span></div>
                <a href="tel:+37069877919">+370 698 77919</a>
              </div>
              <div className="ak-person">
                <div><strong>Laura Bendikaitė</strong><span>Gamybos vadovas</span></div>
                <a href="tel:+37067716667">+370 677 16667</a>
              </div>
              <a className="ak-text-link" href="mailto:jonas@akmendarba.lt">jonas@akmendarba.lt <ArrowUpRight aria-hidden="true" size={16} /></a>
            </Reveal>
          </div>

          <div className="ak-contact-page__secondary">
            <Reveal className="ak-address-card">
              <MapPin aria-hidden="true" size={21} strokeWidth={1.35} />
              <div><p className="ak-kicker">Gamyba</p><h2>Saulėtekio g. 47</h2><p>Einoraičių kaimas, Šiaulių rajonas<br />LT-80141</p></div>
              <a href="https://www.google.com/maps/search/?api=1&query=Saul%C4%97tekio+g.+47,+Einorai%C4%8Diai" target="_blank" rel="noreferrer">Atverti žemėlapį <ArrowUpRight aria-hidden="true" size={16} /></a>
            </Reveal>
            <Reveal className="ak-address-card" delay={0.08}>
              <MapPin aria-hidden="true" size={21} strokeWidth={1.35} />
              <div><p className="ak-kicker">Paminklų pardavimo aikštelė</p><h2>Tilžės g. 234</h2><p>Šiauliai</p></div>
              <a href="https://www.google.com/maps/search/?api=1&query=Til%C5%BE%C4%97s+g.+234,+%C5%A0iauliai" target="_blank" rel="noreferrer">Atverti žemėlapį <ArrowUpRight aria-hidden="true" size={16} /></a>
            </Reveal>
          </div>
        </div>

        <div className="content-shell ak-map">
          <iframe
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Saul%C4%97tekio%20g.%2047%2C%20Einorai%C4%8Diai%2C%20%C5%A0iauli%C5%B3%20r.&output=embed"
            title="Akmendarba gamybos vieta Einoraičiuose"
          />
        </div>
      </section>

      <section className="ak-company-details ak-section ak-section--dark" aria-labelledby="ak-company-title">
        <div className="content-shell ak-company-details__grid">
          <Reveal><p className="ak-kicker">Rekvizitai</p><h2 id="ak-company-title">Akmendarba, UAB</h2></Reveal>
          <Reveal className="ak-company-details__list" delay={0.08}>
            <dl>
              <div><dt>Įmonės kodas</dt><dd>300526494</dd></div>
              <div><dt>PVM mokėtojo kodas</dt><dd>100002337416</dd></div>
              <div><dt>Atsiskaitomoji sąskaita</dt><dd>LT 597300010093304943</dd></div>
              <div><dt>Bankas</dt><dd>Swedbank</dd></div>
              <div><dt>Banko kodas</dt><dd>7300</dd></div>
              <div><dt>S.W.I.F.T.</dt><dd>HABALT 22</dd></div>
            </dl>
            <div className="ak-social-links">
              <a href="https://www.facebook.com/akmendarba.granitas/" target="_blank" rel="noreferrer">Facebook <ArrowUpRight aria-hidden="true" size={16} /></a>
              <a href="https://www.instagram.com/akmendarba/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight aria-hidden="true" size={16} /></a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
