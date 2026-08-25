import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/data/content";
import { getProjectThemeStory } from "@/data/project-themes";
import { Breadcrumbs, EditorialCta } from "@/components/content/page-chrome";
import { ProjectThemeStory } from "@/components/content/project-theme-story";
import { Reveal } from "@/components/reveal";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: `${project.displayLabel} · atlikti darbai`,
    description: "Teminė skirtingų Granit Decor atliktų darbų vaizdų atranka iš viešo įmonės archyvo.",
  };
}

export default async function ProjectArchivePage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const story = getProjectThemeStory(project.id);

  return (
    <>
      <article className="project-record">
        <header className="project-record__header content-shell">
          <Breadcrumbs items={[{ label: "Projektai", href: "/projektai" }, { label: project.displayLabel }]} />
          <Reveal className="project-record__title" y={18}>
            <h1>{project.displayLabel}</h1>
          </Reveal>
        </header>

        <Reveal className="project-record__image" y={14}>
          <figure className="page-shell" data-ratio={project.imageOrientation}>
            <Image src={project.image.src} alt={project.image.alt} fill loading="eager" priority sizes="100vw" />
            <figcaption>Pirminis viešo darbų archyvo vaizdas</figcaption>
          </figure>
        </Reveal>
      </article>

      <ProjectThemeStory story={story} />

      <EditorialCta
        title="Turite kryptį savo erdvei?"
        body="Projekto plane pridėkite patikusių vaizdų nuorodas ir nurodykite, kuriuos paviršiaus, formos ar kompozicijos principus norite aptarti."
      />
    </>
  );
}
