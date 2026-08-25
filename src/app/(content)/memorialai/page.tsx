import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { EditorialHero } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Memorialiniai akmens gaminiai",
  description:
    "Individualiai aptariami memorialiniai natūralaus akmens gaminiai. Susisiekite dėl formos, užrašo, medžiagos ir įrengimo sąlygų.",
};

const memorialSteps = [
  {
    title: "Pirminis aptarimas",
    body: "Aptariame vietą, norimą formą, užrašą ir jau priimtus sprendimus.",
  },
  {
    title: "Forma, medžiaga ir užrašas",
    body: "Suderiname proporcijas, akmenį, užrašo turinį ir įrengimo sąlygas.",
  },
  {
    title: "Patvirtinimas prieš gamybą",
    body: "Prieš gamybą patvirtinate galutinį sprendimą. Vardus, datas ir kitą tekstą tikriname ypač atidžiai.",
  },
  {
    title: "Gamyba ir įrengimas",
    body: "Gaminį pristatome ir įrengiame pagal suderintą darbų apimtį bei vietos sąlygas.",
  },
] as const;

const memorialProducts = [
  "Antkapiai",
  "Paminklai",
  "Akmens sienelės",
  "Tvorelės",
  "Kapo uždengimo plokštės",
] as const;

export default function MemorialPage() {
  return (
    <div className="memorial-page">
      <EditorialHero
        breadcrumbs={[{ label: "Memorialai" }]}
        eyebrow="Memorialai"
        folio="Individualus darbas"
        tone="inverse"
        title="Memorialiniai akmens gaminiai."
        body="Individualiai deriname formą, medžiagą, užrašą, pristatymą ir įrengimą."
        image="/assets/materials/jet-black.webp"
        imageAlt="Tamsaus granito paviršiaus fragmentas."
        imageRatio="landscape"
        caption="Medžiagos fragmentas · ne gaminio pavyzdys"
      />

      <section className="memorial-intro section" aria-labelledby="memorial-intro-title">
        <div className="content-shell memorial-intro__grid">
          <Reveal>
            <h2 id="memorial-intro-title">Sprendimą deriname individualiai.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              Įvertiname vietą, proporcijas, užrašą, pasirinktą akmenį ir darbų apimtį. Galutinį sprendimą patvirtinate prieš gamybą.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="application-scope section" aria-labelledby="memorial-products-title">
        <div className="content-shell application-scope__grid">
          <Reveal className="application-scope__heading">
            <h2 id="memorial-products-title">Gaminiai ir vientisos kompozicijos.</h2>
          </Reveal>

          <Reveal className="application-scope__list" delay={0.06}>
            <ul>
              {memorialProducts.map((product) => (
                <li key={product}>
                  <Check aria-hidden="true" size={17} strokeWidth={1.7} />
                  <span>{product}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="application-scope__capabilities" delay={0.12}>
            <Link className="text-link" href="/gaminiai/antkapiai-ir-paminklai">
              Informacija apie gaminius <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="memorial-process section" aria-labelledby="memorial-process-title">
        <div className="content-shell memorial-process__heading">
          <Reveal>
            <h2 id="memorial-process-title">Nuo aptarimo iki įrengimo.</h2>
          </Reveal>
        </div>
        <ol className="content-shell memorial-process__list">
          {memorialSteps.map((step, index) => (
            <Reveal delay={index * 0.06} key={step.title}>
              <li>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="memorial-contact section section--inverse" aria-labelledby="memorial-contact-title">
        <div className="reading-shell">
          <Reveal>
            <h2 id="memorial-contact-title">Susisiekite dėl individualaus aptarimo.</h2>
            <p>
              Skambinkite <a href="tel:+37065023784">+370 650 23784</a> arba rašykite <a href="mailto:stone@granitdecor.lt">stone@granitdecor.lt</a>.
            </p>
            <Link className="text-link" href="/kontaktai">
              Kontaktai ir atvykimo vieta <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
