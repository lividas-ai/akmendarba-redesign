"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Columns3, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import type { Material, MaterialCategory } from "@/client/materials";

type MaterialCompareProps = {
  materials: readonly Material[];
  categoryNames: Readonly<Record<MaterialCategory, string>>;
  onRemove: (slug: string) => void;
  onClear: () => void;
};

export function MaterialCompare({
  materials,
  categoryNames,
  onRemove,
  onClear,
}: MaterialCompareProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const projectHref = useMemo(
    () => `/projektas?akmenys=${encodeURIComponent(materials.map((material) => material.slug).join(","))}`,
    [materials],
  );

  useEffect(() => {
    if (materials.length === 0 && dialogRef.current?.open) dialogRef.current.close();
  }, [materials.length]);

  if (materials.length === 0) return null;

  function openComparison() {
    dialogRef.current?.showModal();
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
  }

  return (
    <>
      <aside className="compare-drawer" aria-label="Akmenų palyginimas">
        <div className="compare-drawer__heading">
          <Columns3 aria-hidden="true" size={18} strokeWidth={1.5} />
          <div>
            <strong>Palyginimas</strong>
            <span>{materials.length} iš 3</span>
          </div>
        </div>

        <div className="compare-drawer__selection" aria-label="Pasirinkti akmenys">
          {materials.map((material) => (
            <span className="compare-drawer__item" key={material.slug}>
              <span>{material.name}</span>
              <button
                type="button"
                onClick={() => onRemove(material.slug)}
                aria-label={`Pašalinti „${material.name}“ iš palyginimo`}
              >
                <X aria-hidden="true" size={15} strokeWidth={1.7} />
              </button>
            </span>
          ))}
        </div>

        <div className="compare-drawer__actions">
          <button className="compare-drawer__clear" type="button" onClick={onClear}>
            Išvalyti
          </button>
          <button
            className="button button--primary"
            type="button"
            disabled={materials.length < 2}
            onClick={openComparison}
          >
            {materials.length < 2 ? "Pasirinkite dar 1" : `Palyginti ${materials.length}`}
          </button>
        </div>
      </aside>

      <dialog
        className="material-dialog compare-dialog"
        ref={dialogRef}
        aria-labelledby="compare-dialog-title"
        aria-describedby="compare-dialog-description"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <div className="compare-dialog__panel">
          <header className="compare-dialog__header">
            <div>
              <span className="eyebrow">Atranka</span>
              <h2 id="compare-dialog-title">Akmenų palyginimas</h2>
              <p id="compare-dialog-description">
                Lyginami tik kataloge žinomi duomenys. Galutinį pasirinkimą atlikite įvertinę konkrečią plokštę.
              </p>
            </div>
            <button
              className="material-dialog__close"
              ref={closeButtonRef}
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Uždaryti palyginimą"
            >
              <X aria-hidden="true" size={22} strokeWidth={1.5} />
            </button>
          </header>

          <div className="compare-table-wrap" tabIndex={0} aria-label="Slinkite horizontaliai, jei reikia">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Kriterijus</th>
                  {materials.map((material) => (
                    <th scope="col" key={material.slug}>
                      <span className="compare-table__visual">
                        <Image
                          alt=""
                          fill
                          sizes="(min-width: 48rem) 22vw, 44vw"
                          src={material.localPath}
                        />
                      </span>
                      <span className="compare-table__name">{material.name}</span>
                      <button type="button" onClick={() => onRemove(material.slug)}>
                        Pašalinti
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Akmens rūšis</th>
                  {materials.map((material) => (
                    <td key={material.slug}>{categoryNames[material.category]}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Natūrali variacija</th>
                  {materials.map((material) => (
                    <td key={material.slug}>Kiekviena plokštė turi savitą atspalvį ir raštą.</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <footer className="compare-dialog__footer">
            <p>
              Katalogo vaizdai nėra konkrečios plokštės garantija. Projekto metu galima aptarti tinkamiausią pasirinkimą.
            </p>
            <Link className="button button--primary" href={projectHref}>
              Pridėti atranką prie projekto
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </footer>
        </div>
      </dialog>
    </>
  );
}
