import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/button-link";
import { applications, processSteps, projects, siteCopy } from "@/data/content";
import { materials } from "@/data/materials";

const materialSequence = [
  "patagonia",
  "calacatta-paonazzo",
  "portoro-oro",
  "via-lattea",
  "orange-onyx",
];

export default function HomePage() {
  const selectedMaterials = materialSequence
    .map((slug) => materials.find((material) => material.slug === slug))
    .filter((material) => material !== undefined);
  const featuredApplications = applications.filter((application) => application.featured);
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      <HomeHero />

      <section className="home-applications section" aria-labelledby="applications-title">
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              align="split"
              eyebrow="Gaminiai"
              id="applications-title"
              title="Gaminiai pagal erdvę ir paskirtį."
            />
          </Reveal>

          <div className="application-grid">
            {featuredApplications.map((application, index) => (
              <Reveal className={`application-grid__item application-grid__item--${index + 1}`} delay={(index % 3) * 0.08} key={application.id}>
                <Link className="application-card" href={application.href}>
                  <Image
                    src={application.image.src}
                    alt={application.image.alt}
                    fill
                    sizes={index === 0 ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 36vw, 100vw"}
                  />
                  <span className="application-card__content">
                    <strong>{application.shortTitle}</strong>
                  </span>
                  <span className="application-card__arrow" aria-hidden="true">
                    <ArrowUpRight size={20} strokeWidth={1.5} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="home-applications__footer">
            <ButtonLink href="/gaminiai" variant="secondary">
              Visi gaminiai
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="home-materials section section--inverse" aria-labelledby="materials-title">
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              align="split"
              eyebrow="Akmuo"
              id="materials-title"
              title="Natūralaus akmens rūšys ir raštai."
            />
          </Reveal>
        </div>

        <div className="material-stage page-shell">
          {selectedMaterials.map((material, index) => (
            <Reveal className={`material-stage__item material-stage__item--${index + 1}`} delay={index * 0.055} key={material.slug} y={18}>
              <Link className="material-editorial-card" href={`/akmuo/${material.slug}`}>
                <Image src={material.localPath} alt={`${material.name} akmens paviršius`} fill sizes="(min-width: 1024px) 28vw, 75vw" />
                <span className="material-editorial-card__meta">
                  <strong>{material.name}</strong>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="content-shell home-materials__footer">
          <p>
            Natūralaus akmens raštas ir tonas gali skirtis nuo katalogo nuotraukos. Galutinį pasirinkimą derinkite pagal konkrečią plokštę ir projektą.
          </p>
          <ButtonLink href="/akmuo" variant="inverse">
            Visa akmens kolekcija
          </ButtonLink>
        </div>
      </section>

      <section className="home-projects section" aria-labelledby="projects-title">
        <div className="content-shell">
          <Reveal>
            <SectionHeading
              align="split"
              eyebrow="Projektai"
              id="projects-title"
              title="Atlikti darbai realiose erdvėse."
            />
          </Reveal>

          <div className="project-editorial-grid">
            {featuredProjects.map((project, index) => (
              <Reveal className={`project-editorial-grid__item project-editorial-grid__item--${index + 1}`} key={project.id} delay={index * 0.09}>
                <Link className="project-editorial-card" href={`/projektai/${project.slug}`}>
                  <figure>
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      fill
                      sizes={index === 0 ? "(min-width: 768px) 62vw, 100vw" : "(min-width: 768px) 32vw, 100vw"}
                    />
                  </figure>
                  <div>
                    <h3>{project.displayLabel}</h3>
                    <ArrowUpRight aria-hidden="true" size={20} strokeWidth={1.5} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="home-projects__link-row">
            <ButtonLink href="/projektai" variant="secondary">
              Peržiūrėti projektus
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="home-process section" aria-labelledby="process-title">
        <div className="content-shell home-process__layout">
          <div className="home-process__visual">
            <Reveal>
              <figure>
                <Image
                  src="/assets/portfolio/granit-decor-darbai-septyniolika.webp"
                  alt="Tamsaus natūralaus akmens virtuvės stalviršio detalė"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                />
              </figure>
            </Reveal>
          </div>

          <div className="home-process__content">
            <Reveal>
              <h2 className="display-title" id="process-title">
                Nuo projekto iki montavimo.
              </h2>
            </Reveal>
            <ol className="process-list">
              {processSteps.map((step, index) => (
                <Reveal delay={index * 0.045} key={step.id}>
                  <li>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <ButtonLink href="/kaip-dirbame" variant="secondary">
              Kaip dirbame
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="home-professionals page-shell" aria-labelledby="professionals-title">
        <figure className="home-professionals__media">
          <Image
            src="/assets/portfolio/granit-decor-darbai-devyni.webp"
            alt="Atviro plano interjeras su Granit Decor akmens paviršiais"
            fill
            sizes="100vw"
          />
        </figure>
        <div className="home-professionals__overlay" />
        <div className="home-professionals__content content-shell">
          <Reveal>
            <h2 id="professionals-title">{siteCopy.professionals.title}</h2>
            <p>{siteCopy.professionals.body}</p>
            <ButtonLink href="/profesionalams" variant="inverse">
              Aptarti bendradarbiavimą
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <section className="home-final section" aria-labelledby="final-title">
        <div className="content-shell home-final__layout">
          <Reveal>
            <h2 id="final-title">Aptarkime jūsų projektą.</h2>
          </Reveal>
          <Reveal className="home-final__action" delay={0.12}>
            <p>{siteCopy.finalCallToAction.body}</p>
            <Link className="home-final__circle" href="/projektas" aria-label="Pradėti projekto planą">
              <span>Pradėti projektą</span>
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
