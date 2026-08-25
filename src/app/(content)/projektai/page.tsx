import type { Metadata } from "next";
import { projects } from "@/data/content";
import { EditorialCta, EditorialHero } from "@/components/content/page-chrome";
import { ProjectArchiveGrid } from "@/components/content/project-archive-grid";
import { FullPortfolioGallery } from "@/components/content/full-portfolio-gallery";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Atlikti darbai",
  description:
    "Granit Decor atliktų darbų galerija: virtuvės, vonios erdvės ir individualios akmens detalės.",
};

export default function ProjectsPage() {
  return (
    <>
      <EditorialHero
        breadcrumbs={[{ label: "Projektai" }]}
        eyebrow="Projektai"
        folio="Atlikti darbai"
        title="Granit Decor atlikti darbai."
        body="Virtuvės, vonios erdvės ir individualios akmens detalės realiame mastelyje."
        image="/assets/portfolio/granit-decor-darbai-trisdesimt-trys.webp"
        imageAlt="Granit Decor įgyvendintas interjeras su natūralaus akmens apdaila."
        imageRatio="landscape"
        caption="Granit Decor darbų archyvas"
        imagePosition="50% 50%"
      />

      <section className="projects-index section" aria-labelledby="projects-index-title">
        <div className="content-shell projects-index__heading">
          <Reveal>
            <h2 id="projects-index-title">Peržiūrėkite darbus pagal erdvę.</h2>
          </Reveal>
        </div>
        <div className="content-shell">
          <ProjectArchiveGrid projects={projects} filterable />
        </div>
      </section>

      <section className="section" aria-label="Visa Granit Decor darbų galerija">
        <div className="content-shell">
          <FullPortfolioGallery />
        </div>
      </section>

      <EditorialCta
        title="Aptarkime jūsų erdvę."
        body="Atsiųskite nuotraukas, brėžinį ar nuotaikos koliažą. Parinksime jūsų projektui tinkamą akmens sprendimą."
      />
    </>
  );
}
