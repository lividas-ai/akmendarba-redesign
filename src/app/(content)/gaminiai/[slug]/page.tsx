import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { applications } from "@/client/content";
import { materials } from "@/client/materials";
import { applicationDetails } from "@/client/application-details";
import { EditorialCta, EditorialHero } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/button-link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const sampleMaterialSlugs = ["patagonia", "calacatta-paonazzo", "via-lattea"];
const projectCapabilities = [
  "Konsultacija ir projektavimas",
  "Matavimas objekte",
  "Gamyba pagal suderintą projektą",
  "Pristatymas specializuotu transportu",
  "Montavimas",
  "Impregnavimas, kai jis reikalingas",
] as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return applications.map((application) => ({ slug: application.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const application = applications.find((item) => item.slug === slug);
  if (!application) return {};

  return {
    title: application.title,
    description: `${application.description} Individuali gamyba, matavimas, pristatymas ir montavimas.`,
  };
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const application = applications.find((item) => item.slug === slug);
  if (!application) notFound();
  const details = applicationDetails[application.id];
  const relatedApplications = details.relatedApplicationIds
    .map((applicationId) => applications.find((item) => item.id === applicationId))
    .filter((item) => item !== undefined);
  const sampleMaterials = sampleMaterialSlugs
    .map((materialSlug) => materials.find((material) => material.slug === materialSlug))
    .filter((material) => material !== undefined);
  const heroImageRatio = application.id === "virtuves-stalvirsiai"
    ? "portrait"
    : application.id === "kolonos"
      ? "vertical"
      : application.id === "lauko-baldai"
        ? "square"
        : application.id === "zidiniu-apdaila"
          ? "wide"
          : "landscape";

  return (
    <>
      <EditorialHero
        breadcrumbs={[{ label: "Gaminiai", href: "/gaminiai" }, { label: application.shortTitle }]}
        eyebrow={application.shortTitle}
        folio="Individuali gamyba"
        title={application.title}
        body={details.heroBody}
        image={details.heroImage}
        imageAlt={details.heroAlt}
        imageRatio={heroImageRatio}
        imagePosition={details.imagePosition}
        caption={details.heroCaption}
      >
        <ButtonLink href={`/projektas?gaminys=${application.id}`}>Aptarti šį gaminį</ButtonLink>
      </EditorialHero>

      <section className="application-scope section" aria-labelledby="application-scope-title">
        <div className="content-shell application-scope__grid">
          <Reveal className="application-scope__heading">
            <h2 id="application-scope-title">Ką galime pagaminti.</h2>
          </Reveal>
          <Reveal className="application-scope__list" delay={0.08}>
            <ul>
              {details.offerings.map((offering) => (
                <li key={offering}>
                  <Check aria-hidden="true" size={18} strokeWidth={1.7} />
                  <span>{offering}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="application-scope__capabilities" delay={0.12}>
            <ul>
              {projectCapabilities.map((capability) => <li key={capability}>{capability}</li>)}
            </ul>
            <Link className="text-link" href="/kaip-dirbame">
              Peržiūrėti darbo eigą <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="application-statement section" aria-labelledby="application-statement-title">
        <div className="content-shell application-statement__grid">
          <Reveal className="application-statement__copy" delay={0.08}>
            <h2 id="application-statement-title">{details.statement}</h2>
            <p>{details.statementBody}</p>
          </Reveal>
        </div>
      </section>

      <section className="application-considerations section section--inverse" aria-labelledby="considerations-title">
        <div className="content-shell">
          <Reveal className="application-considerations__heading">
            <h2 id="considerations-title">Ką reikia suderinti prieš gamybą.</h2>
          </Reveal>
          <ol className="application-considerations__list">
            {details.considerations.map((item, index) => (
              <Reveal delay={index * 0.07} key={item.title}>
                <li>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="application-inputs section" aria-labelledby="project-inputs-title">
        <div className="content-shell application-inputs__grid">
          <Reveal className="application-inputs__media">
            <figure>
              <Image src={details.secondaryImage} alt={details.secondaryAlt} fill sizes="(min-width: 64rem) 48vw, 100vw" />
            </figure>
          </Reveal>
          <div className="application-inputs__copy">
            <Reveal>
              <h2 id="project-inputs-title">Ko reikia pirmajam vertinimui.</h2>
            </Reveal>
            <ul>
              {details.projectInputs.map((item, index) => (
                <Reveal delay={index * 0.045} key={item}>
                  <li>
                    <Check aria-hidden="true" size={18} strokeWidth={1.7} />
                    <span>{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <ButtonLink href={`/projektas?gaminys=${application.id}`} variant="secondary">Pradėti projekto planą</ButtonLink>
          </div>
        </div>
      </section>

      <section className="application-materials section" aria-labelledby="application-materials-title">
        <div className="content-shell application-materials__heading">
          <Reveal>
            <h2 id="application-materials-title">Pasirinkite akmenį.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p>{details.materialPrompt}</p>
            <Link className="text-link" href="/akmuo">
              Tyrinėti akmens kolekciją <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </Reveal>
        </div>
        <div className="application-materials__strip page-shell">
          {sampleMaterials.map((material, index) => (
            <Reveal delay={index * 0.07} key={material.slug}>
              <Link href={`/akmuo/${material.slug}`}>
                <figure>
                  <Image src={material.localPath} alt={`${material.name} akmens paviršiaus fragmentas`} fill sizes="(min-width: 48rem) 34vw, 78vw" />
                </figure>
                <span>{material.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="application-related section" aria-labelledby="application-related-title">
        <div className="content-shell application-related__heading">
          <Reveal>
            <h2 id="application-related-title">Kiti gaminiai tam pačiam projektui.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Link className="text-link" href="/gaminiai">
              Visi gaminiai ir paslaugos <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </Reveal>
        </div>
        <div className="content-shell application-related__grid">
          {relatedApplications.map((relatedApplication, index) => (
            <Reveal delay={index * 0.06} key={relatedApplication.id}>
              <Link href={relatedApplication.href}>
                <Image
                  src={relatedApplication.image.src}
                  alt={relatedApplication.image.alt}
                  fill
                  sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 48vw, 100vw"
                />
                <span>
                  <strong>{relatedApplication.shortTitle}</strong>
                  <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.5} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <EditorialCta
        title="Aptarkime jūsų projektą."
        body={application.planningNote}
        secondaryLabel="Kaip dirbame"
        secondaryHref="/kaip-dirbame"
      />
    </>
  );
}
