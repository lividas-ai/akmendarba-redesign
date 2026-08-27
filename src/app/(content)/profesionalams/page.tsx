import type { Metadata } from "next";
import Image from "next/image";
import { Check, FileText, Layers3, Ruler, Workflow } from "lucide-react";
import { professionalCollaboration } from "@/client/content";
import { EditorialCta, EditorialHero } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Architektams ir interjero profesionalams",
  description:
    "Natūralaus akmens gamybos bendradarbiavimas architektams, interjero dizaineriams, baldų gamintojams ir rangovams.",
};

const audiences = [
  { title: "Architektams", note: "Architektūrinių detalių, medžiagos ir projekto sąlygų derinimas." },
  { title: "Interjero dizaineriams", note: "Rašto, proporcijų ir ryšio su kitomis medžiagomis derinimas." },
  { title: "Baldų gamintojams", note: "Stalviršių, išpjovų, kraštų ir jungčių su baldo konstrukcija tikslinimas." },
  { title: "Rangovams", note: "Matavimo, gamybos, pristatymo ir montavimo darbų koordinavimas." },
] as const;

const handoffItems = [
  "Brėžiniai su pagrindiniais matmenimis ir aktualiomis išklotinėmis",
  "Įrangos, praustuvų, kaitlenčių ar kitų integruojamų elementų modeliai",
  "Medžiagų paletė arba norimo akmens pavyzdžiai",
  "Objekto vieta, projekto stadija ir aktualus darbų eiliškumas",
] as const;

const collaborationIcons = [Layers3, Ruler, FileText, Workflow] as const;

export default function ProfessionalsPage() {
  return (
    <>
      <EditorialHero
        breadcrumbs={[{ label: "Profesionalams" }]}
        eyebrow="Profesionalams"
        folio="Projektų partneriams"
        title="Akmens gamyba architektūros ir interjero projektams."
        body="Deriname medžiagą, matmenis, technines detales ir darbų eigą su jūsų projektu."
        image="/assets/portfolio/granit-decor-darbai-dvidesimt-sesi.webp"
        imageAlt="Didelio formato natūralaus akmens sienos apdaila interjere."
        imageRatio="landscape"
        caption="Granit Decor darbų archyvas · architektūrinis paviršius"
      />

      <section className="professional-audiences section" aria-labelledby="professional-audiences-title">
        <div className="content-shell professional-audiences__heading">
          <Reveal>
            <h2 id="professional-audiences-title">Su kuo dirbame.</h2>
          </Reveal>
        </div>
        <div className="content-shell professional-audiences__list">
          {audiences.map((audience, index) => (
            <Reveal delay={index * 0.06} key={audience.title}>
              <article>
                <h3>{audience.title}</h3>
                <p>{audience.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="professional-collaboration section section--inverse" aria-labelledby="professional-collaboration-title">
        <div className="content-shell">
          <Reveal className="professional-collaboration__heading">
            <h2 id="professional-collaboration-title">Darbai per visą projekto eigą.</h2>
          </Reveal>
          <div className="professional-collaboration__grid">
            {professionalCollaboration.map((item, index) => {
              const Icon = collaborationIcons[index];
              return (
                <Reveal delay={index * 0.07} key={item.id}>
                  <article>
                    <Icon aria-hidden="true" size={26} strokeWidth={1.3} />
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="professional-handoff section" aria-labelledby="professional-handoff-title">
        <div className="content-shell professional-handoff__grid">
          <Reveal className="professional-handoff__image">
            <figure>
              <Image src="/assets/portfolio/granit-decor-darbai-astuoni.webp" alt="Įgyvendinta virtuvės erdvė su Granit Decor akmens paviršiais." fill sizes="(min-width: 64rem) 45vw, 100vw" />
            </figure>
          </Reveal>
          <div className="professional-handoff__copy">
            <Reveal>
              <h2 id="professional-handoff-title">Informacija pirmajam vertinimui.</h2>
              <p>
                Failų formatą ir detalumą suderinsime pagal projektą. Pradžiai naudinga:
              </p>
            </Reveal>
            <ul>
              {handoffItems.map((item, index) => (
                <Reveal delay={index * 0.045} key={item}>
                  <li>
                    <Check aria-hidden="true" size={18} strokeWidth={1.7} />
                    <span>{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <EditorialCta
        eyebrow="Profesionalams"
        title="Aptarkime projektą prieš galutinį detalizavimą."
        body="Atsiųskite turimą medžiagą, nurodykite projekto stadiją ir numatomus darbų terminus."
        actionLabel="Aptarti bendradarbiavimą"
        actionHref="/kontaktai"
      />
    </>
  );
}
