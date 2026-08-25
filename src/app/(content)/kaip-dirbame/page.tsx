import type { Metadata } from "next";
import { processSteps } from "@/data/content";
import { EditorialCta, EditorialHero } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Kaip dirbame",
  description:
    "Granit Decor projekto eiga: poreikio aptarimas, akmens parinkimas, matavimas ir projektavimas, gamyba, pristatymas bei montavimas.",
};

const decisionPoints = [
  {
    title: "Kada galima skaičiuoti pasiūlymą?",
    body: "Kai žinomas gaminio tipas, apytikriai matmenys, pageidaujamas akmuo ir darbų apimtis. Tiksliam sprendiniui gali reikėti brėžinio bei matavimo.",
  },
  {
    title: "Ar akmenį reikia išsirinkti iš karto?",
    body: "Ne. Pradėti galite nuo norimos spalvos ir rašto. Konkrečią plokštę vertinsime kartu su gaminio proporcijomis.",
  },
  {
    title: "Kodėl svarbus galutinis matavimas?",
    body: "Nuo faktinių matmenų priklauso išpjovos, jungtys ir sąlytis su kitais paviršiais. Juos suderiname prieš pjaunant akmenį.",
  },
] as const;

export default function ProcessPage() {
  return (
    <>
      <EditorialHero
        breadcrumbs={[{ label: "Kaip dirbame" }]}
        eyebrow="Kaip dirbame"
        folio="Darbo eiga"
        title="Nuo užklausos iki montavimo."
        body="Projektą suskirstome į aiškius etapus, o medžiagą, matmenis ir technines detales suderiname prieš gamybą."
        image="/assets/portfolio/granit-decor-darbai-dvidesimt-sesi.webp"
        imageAlt="Individualiai pagaminta Granit Decor akmens detalė interjere."
        imageRatio="landscape"
        caption="Granit Decor darbų archyvas · individuali gamyba"
        imagePosition="50% 50%"
      />

      <section className="process-editorial section" aria-labelledby="process-editorial-title">
        <div className="content-shell process-editorial__heading">
          <Reveal>
            <h2 id="process-editorial-title">Projekto eiga.</h2>
          </Reveal>
        </div>

        <ol className="process-editorial__steps content-shell">
          {processSteps.map((step, index) => (
            <li key={step.id}>
              <Reveal delay={index * 0.055}>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="process-decisions section" aria-labelledby="process-decisions-title">
        <div className="content-shell process-decisions__grid">
          <Reveal className="process-decisions__lead">
            <h2 id="process-decisions-title">Ką žinoti prieš pradedant.</h2>
          </Reveal>
          <div className="process-decisions__list">
            {decisionPoints.map((item, index) => (
              <Reveal delay={index * 0.06} key={item.title}>
                <article>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <EditorialCta
        title="Atsiųskite tai, ką jau turite."
        body="Pirmajam pokalbiui pakanka eskizo, nuotraukos ar apytikrių matmenų."
        actionLabel="Parengti projekto planą"
      />
    </>
  );
}
