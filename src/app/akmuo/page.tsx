import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MaterialExplorer } from "@/components/materials/material-explorer";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Akmens kolekcija",
  description:
    "Peržiūrėkite Granit Decor granito, marmuro, kvarcito, onikso ir travertino kolekciją. Išsaugokite pasirinktus variantus savo projektui.",
};

const otherSurfaces = [
  {
    name: "Kvarcinis akmuo / kvarcas",
    note: "Kompoziciniai paviršiai stalviršiams ir kitoms individualiai gaminamoms detalėms.",
  },
  {
    name: "Laminam",
    note: "Didelio formato paviršiai. Kolekciją ir pritaikymą tiksliname pagal projektą.",
  },
  {
    name: "Quarella Quartz",
    note: "Variantus ir prieinamumą patvirtiname projekto aptarimo metu.",
  },
  {
    name: "Dirbtinis akmuo",
    note: "Kitus kompozicinius paviršius parenkame pagal gaminį ir naudojimo vietą.",
  },
] as const;

export default function MaterialsPage() {
  return (
    <>
      <MaterialExplorer />

      <section className="other-surfaces section" aria-labelledby="other-surfaces-title">
        <div className="content-shell other-surfaces__grid">
          <Reveal className="other-surfaces__intro">
            <h2 id="other-surfaces-title">Kiti užsakomi paviršiai.</h2>
            <p>
              Galimus gamintojus, kolekcijas ir prieinamumą patvirtiname pagal konkretų projektą.
            </p>
            <Link className="text-link" href="/projektas">
              Aptarti paviršiaus pasirinkimą <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </Reveal>

          <div className="other-surfaces__list">
            {otherSurfaces.map((surface, index) => (
              <Reveal delay={index * 0.05} key={surface.name}>
                <article>
                  <h3>{surface.name}</h3>
                  <p>{surface.note}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
