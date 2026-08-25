import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs, EditorialCta } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Kaip rinktis akmenį virtuvės stalviršiui",
  description:
    "Kaip rinktis natūralų akmenį virtuvės stalviršiui: naudojimas, planas, išpjovos, rašto mastelis, paviršius ir priežiūra.",
};

const selectionSteps = [
  {
    id: "naudojimas",
    title: "Įvertinkite, kaip naudojate virtuvę",
    body: "Gaminimo intensyvumas, dažniausiai naudojamos priemonės ir požiūris į natūralią patiną padeda nustatyti svarbiausias medžiagos savybes.",
  },
  {
    id: "planas",
    title: "Turėkite bent apytikrį planą",
    body: "Ilgiai, gyliai, salos forma ir sienelės aukštis parodo būsimo paviršiaus mastelį. Gamybai reikės tikslių matmenų.",
  },
  {
    id: "iranga",
    title: "Nurodykite įrangą ir išpjovas",
    body: "Plautuvė, kaitlentė, maišytuvas ir kita integruojama įranga lemia išpjovas bei jungtis. Jų modelius pasirinkite iki galutinio derinimo.",
  },
  {
    id: "plokste",
    title: "Vertinkite visą plokštę, ne vien fragmentą",
    body: "Mažas pavyzdys neparodo, kaip gyslos atrodys ilgame stalviršyje ar saloje. Ryškiam raštui ypač svarbios kryptys ir jungtys.",
  },
  {
    id: "prieziura",
    title: "Susitarkite dėl paviršiaus ir priežiūros",
    body: "Apdaila keičia išvaizdą ir priežiūrą. Išsiaiškinkite, kaip paviršius valomas, ar jam reikės impregnavimo ir kokie naudojimo pėdsakai gali likti.",
  },
] as const;

export default function KitchenStoneGuide() {
  return (
    <>
      <article className="journal-article journal-article--kitchen">
        <header className="journal-article__header content-shell">
          <Breadcrumbs items={[{ label: "Žurnalas", href: "/zurnalas" }, { label: "Kaip rinktis virtuvės stalviršį" }]} />
          <Reveal className="journal-article__title" y={18}>
            <h1>Kaip rinktis akmenį virtuvės stalviršiui.</h1>
            <p>
              Prieš rinkdamiesi spalvą įvertinkite naudojimą, virtuvės planą, įrangą ir priežiūros lūkesčius.
            </p>
          </Reveal>
          <div className="journal-article__meta">
            <span>Pasirinkimo eiga</span>
            <span>Natūralaus akmens stalviršio planavimas</span>
          </div>
        </header>

        <Reveal className="journal-article__hero" y={14}>
          <figure className="page-shell" data-ratio="wide">
            <Image src="/assets/portfolio/virtuves-baldai-stalvirsiai-trisdesimt-keturi.webp" alt="Granit Decor virtuvė su individualiai pagamintu natūralaus akmens stalviršiu." fill loading="eager" priority sizes="100vw" />
            <figcaption>Granit Decor darbų archyvas · virtuvės erdvė</figcaption>
          </figure>
        </Reveal>

        <div className="journal-article__layout content-shell">
          <aside className="journal-article__aside" aria-label="Straipsnio turinys">
            <span>Turinys</span>
            {selectionSteps.map((step) => (
              <a href={`#${step.id}`} key={step.id}>{step.title}</a>
            ))}
          </aside>

          <div className="journal-article__body">
            <Reveal>
              <p className="journal-article__lead">
                Medžiagos tinkamumas priklauso nuo konkrečios plokštės, apdailos, projekto ir to, kaip naudosite paviršių.
              </p>
            </Reveal>

            {selectionSteps.map((step) => (
              <section id={step.id} key={step.id}>
                <Reveal>
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>
                </Reveal>
              </section>
            ))}

            <aside className="journal-article__callout">
              <span>Katalogo taisyklė</span>
              <p>
                Nuotrauką naudokite kaip atrankos pradžią, ne kaip tikslios spalvos pažadą. Natūralios plokštės raštas, tonas ir mineralinės detalės gali skirtis.
              </p>
            </aside>

            <Reveal className="journal-article__closing">
              <h2>Ką atsinešti į pirmą pokalbį</h2>
              <ol>
                <li>Virtuvės planą ar eskizą su apytikriais matmenimis.</li>
                <li>Pasirinktos įrangos modelius arba bent jų tipą.</li>
                <li>Kelias nuotraukas, rodančias norimą spalvą ir rašto intensyvumą.</li>
                <li>Klausimus apie naudojimą ir priežiūrą, kurie jums iš tiesų svarbūs.</li>
              </ol>
            </Reveal>
          </div>
        </div>
      </article>

      <EditorialCta
        title="Turite virtuvės planą?"
        body="Įkelkite brėžinį arba nurodykite apytikrius matmenis ir pridėkite patikusius akmens variantus."
        actionLabel="Parengti virtuvės projektą"
        actionHref="/projektas"
        secondaryLabel="Virtuvės gaminiai"
        secondaryHref="/gaminiai/virtuves-stalvirsiai"
      />
    </>
  );
}
