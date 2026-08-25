import type { Metadata } from "next";
import Link from "next/link";
import { applications, materialCategories } from "@/data/content";
import { EditorialCta, EditorialHero, ImageSpread } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Natūralaus akmens dirbtuvės",
  description:
    "Granit Decor natūralaus akmens dirbtuvės Lentvaryje. Individualių akmens gaminių projektavimas, gamyba, pristatymas ir montavimas.",
};

const principles = [
  {
    title: "Vertinti visą plokštę",
    body: "Mažas pavyzdys parodo atspalvį, bet ne visą raštą. Gaminio kompoziciją planuojame pagal didesnį plokštės vaizdą.",
  },
  {
    title: "Tikslinti prieš gamybą",
    body: "Matmenis, išpjovas, kraštus ir jungtis suderiname prieš pjaunant medžiagą.",
  },
  {
    title: "Kalbėti apie priežiūrą atvirai",
    body: "Naudojimą ir priežiūrą aptariame pagal pasirinktą akmenį, apdailą ir vietą.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <EditorialHero
        breadcrumbs={[{ label: "Apie mus" }]}
        eyebrow="Granit Decor"
        folio="Lentvaris"
        title="Natūralaus akmens gamyba Lentvaryje."
        body="Projektuojame ir gaminame individualius akmens gaminius, atliekame matavimą, pristatymą ir montavimą."
        image="/assets/portfolio/granit-decor-darbai-dvidesimt-vienas.webp"
        imageAlt="Granit Decor pagamintas natūralaus akmens sprendimas interjere."
        imageRatio="landscape"
        caption="Granit Decor darbų archyvas · individuali akmens detalė"
      />

      <section className="about-intro section" aria-labelledby="about-intro-title">
        <div className="content-shell about-intro__grid">
          <Reveal>
            <h2 id="about-intro-title">Sprendimą deriname pagal erdvę, matmenis ir naudojimą.</h2>
          </Reveal>
          <Reveal className="about-intro__copy" delay={0.08}>
            <p>
              Dirbame su {materialCategories.map((category) => category.name.toLocaleLowerCase("lt-LT")).join(", ")}. Kiekvieną plokštę vertiname atskirai, nes jos raštas ir tonas gali skirtis.
            </p>
          </Reveal>
        </div>
      </section>

      <ImageSpread
        primary={{
          src: "/assets/portfolio/granit-decor-darbai-dvidesimt-astuoni.webp",
          alt: "Interjeras su didelio formato natūralaus akmens sienos apdaila.",
          caption: "Akmuo erdvėje · darbų archyvas",
        }}
        secondary={{
          src: "/assets/portfolio/granit-decor-darbai-trisdesimt-vienas.webp",
          alt: "Granit Decor natūralaus akmens sprendimas vonios erdvėje.",
          caption: "Detalės mastelis · darbų archyvas",
        }}
      />

      <section className="about-principles section section--inverse" aria-labelledby="about-principles-title">
        <div className="content-shell about-principles__heading">
          <Reveal>
            <h2 id="about-principles-title">Kaip priimame gamybos sprendimus.</h2>
          </Reveal>
        </div>
        <div className="content-shell about-principles__grid">
          {principles.map((principle, index) => (
            <Reveal delay={index * 0.07} key={principle.title}>
              <article>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="about-scope section" aria-labelledby="about-scope-title">
        <div className="content-shell about-scope__grid">
          <Reveal>
            <h2 id="about-scope-title">Ką gaminame.</h2>
          </Reveal>
          <ol>
            {applications.map((application, index) => (
              <Reveal delay={index * 0.045} key={application.id}>
                <li>
                  <Link href={application.href}>{application.title}</Link>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <EditorialCta
        title="Aptarkite savo projektą."
        body="Atsiųskite erdvės nuotrauką, eskizą ar brėžinį ir nurodykite, kokį gaminį planuojate."
      />
    </>
  );
}
