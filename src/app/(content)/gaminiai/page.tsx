import type { Metadata } from "next";
import { EditorialCta, EditorialHero } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";
import { ServiceDirectory } from "@/components/content/service-directory";

export const metadata: Metadata = {
  title: "Gaminiai iš natūralaus akmens",
  description:
    "Virtuvės ir vonios stalviršiai, židiniai, sienos, grindys, laiptai, palangės, kolonos, baldai, fasadai ir memorialiniai gaminiai iš akmens.",
};

export default function ApplicationsPage() {
  return (
    <>
      <EditorialHero
        breadcrumbs={[{ label: "Gaminiai" }]}
        eyebrow="Gaminiai"
        folio="Individuali gamyba"
        title="Gaminiai iš natūralaus akmens."
        body="Kiekvieną gaminį projektuojame pagal jo vietą, matmenis, naudojimą ir pasirinktą plokštę."
        image="/assets/portfolio/granit-decor-darbai-trisdesimt-keturi.webp"
        imageAlt="Granit Decor įrengta virtuvė su natūralaus akmens stalviršiais."
        imageRatio="landscape"
        caption="Granit Decor darbų archyvas · virtuvės erdvė"
      />

      <section className="application-index section" aria-labelledby="application-index-title">
        <div className="content-shell application-index__intro">
          <Reveal>
            <h2 id="application-index-title">Pasirinkite gaminį.</h2>
          </Reveal>
        </div>
        <ServiceDirectory />
      </section>

      <EditorialCta
        title="Neradote tinkamos kategorijos?"
        body="Atsiųskite erdvės nuotrauką, eskizą ar apytikrius matmenis. Padėsime nustatyti projekto apimtį."
      />
    </>
  );
}
