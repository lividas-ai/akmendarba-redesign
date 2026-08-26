"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProjectRecord } from "@/data/content";
import { Reveal } from "@/components/reveal";

type ProjectArchiveGridProps = {
  projects: readonly ProjectRecord[];
  compact?: boolean;
  filterable?: boolean;
};

const filters = [
  { id: "visi", label: "Visi" },
  { id: "virtuve", label: "Virtuvės" },
  { id: "vonios-erdve", label: "Vonios" },
  { id: "interjero-elementas", label: "Interjero detalės" },
] as const;

export function ProjectArchiveGrid({ projects, compact = false, filterable = false }: ProjectArchiveGridProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("visi");
  const visibleProjects = useMemo(
    () =>
      activeFilter === "visi"
        ? projects
        : projects.filter((project) => project.categories.includes(activeFilter)),
    [activeFilter, projects],
  );

  return (
    <div className="archive-explorer">
      {filterable ? (
        <div className="archive-filters" aria-label="Filtruoti darbų archyvo vaizdus">
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter.id}
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className={`archive-grid${compact ? " archive-grid--compact" : ""}`} aria-live={filterable ? "polite" : undefined}>
        {visibleProjects.map((project, index) => (
          <Reveal className={`archive-grid__item archive-grid__item--${(index % 6) + 1}`} delay={(index % 3) * 0.055} key={project.id}>
            <Link className="archive-card" href={`/projektai/${project.slug}`}>
              <figure>
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  fill
                  sizes={
                    compact
                      ? "(min-width: 48rem) 32vw, (min-width: 22rem) 46vw, 100vw"
                      : index === 0
                        ? "(min-width: 64rem) 58vw, 100vw"
                        : "(min-width: 64rem) 33vw, (min-width: 22rem) 46vw, 100vw"
                  }
                />
              </figure>
              <div className="archive-card__meta">
                <span>Darbų archyvas</span>
                <h2>{project.displayLabel}</h2>
                <span className="archive-card__open" aria-hidden="true">
                  <ArrowUpRight size={20} strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
