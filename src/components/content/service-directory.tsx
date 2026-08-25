"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  applicationGroups,
  applications,
  type ApplicationGroupId,
} from "@/data/content";

type GroupFilter = "visi" | ApplicationGroupId;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("lt-LT");
}

export function ServiceDirectory() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<GroupFilter>("visi");

  const matchingApplications = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return applications.filter((application) => {
      if (activeGroup !== "visi" && application.group !== activeGroup) return false;
      if (!normalizedQuery) return true;

      return normalize([
        application.title,
        application.shortTitle,
        application.description,
        ...application.keywords,
      ].join(" ")).includes(normalizedQuery);
    });
  }, [activeGroup, query]);

  return (
    <div className="service-directory">
      <div className="content-shell service-directory__tools">
        <label className="service-directory__search">
          <Search aria-hidden="true" size={20} strokeWidth={1.6} />
          <span className="sr-only">Ieškoti gaminio arba paslaugos</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ieškokite: palangės, grindys, stalai…"
          />
        </label>

        <div className="service-directory__filters" aria-label="Gaminio grupė">
          <button type="button" aria-pressed={activeGroup === "visi"} onClick={() => setActiveGroup("visi")}>Visi gaminiai</button>
          {applicationGroups.map((group) => (
            <button
              type="button"
              aria-pressed={activeGroup === group.id}
              onClick={() => setActiveGroup(group.id)}
              key={group.id}
            >
              {group.title}
            </button>
          ))}
        </div>

        <p className="service-directory__result" aria-live="polite">
          Rodoma: {matchingApplications.length}
        </p>
      </div>

      <div className="service-directory__groups">
        {applicationGroups.map((group) => {
          const groupApplications = matchingApplications.filter((application) => application.group === group.id);
          if (groupApplications.length === 0) return null;

          return (
            <section className="service-group content-shell" aria-labelledby={`service-group-${group.id}`} key={group.id}>
              <header className="service-group__heading">
                <h2 id={`service-group-${group.id}`}>{group.title}</h2>
              </header>
              <div className="service-group__grid" data-count={groupApplications.length}>
                {groupApplications.map((application) => (
                  <Link className="service-card" href={application.href} key={application.id}>
                    <figure>
                      <Image
                        src={application.image.src}
                        alt={application.image.alt}
                        fill
                        sizes="(min-width: 70rem) 30vw, (min-width: 44rem) 48vw, 100vw"
                      />
                    </figure>
                    <div className="service-card__copy">
                      <h3>{application.shortTitle}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {matchingApplications.length === 0 ? (
          <div className="content-shell service-directory__empty">
            <h2>Tokio gaminio neradome.</h2>
            <p>Pabandykite kitą žodį arba aprašykite individualų sumanymą projekto formoje.</p>
            <Link className="text-link" href="/projektas">
              Aptarti individualų gaminį <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
