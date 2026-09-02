"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Heart, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { materials } from "@/client/materials";
import {
  MATERIAL_COMPARE_EVENT,
  MATERIAL_SAVED_EVENT,
  MAXIMUM_COMPARED_MATERIALS,
  readComparedMaterials,
  readSavedMaterials,
  toggleComparedMaterial,
  toggleSavedMaterial,
  writeComparedMaterials,
} from "@/lib/material-storage";
import { MaterialCompare } from "@/components/materials/material-compare";
import { MaterialPlate } from "@/components/materials/material-plate";
import { MaterialQuickView } from "@/components/materials/material-quick-view";

const materialBySlug = new Map(materials.map((material) => [material.slug, material]));
const materialSlugs = new Set(materialBySlug.keys());
const heroMaterial = materials[0];

function retainPublishedMaterials(slugs: readonly string[]) {
  return slugs.filter((slug) => materialSlugs.has(slug));
}

export function MaterialExplorer() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const quickViewTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const updateSaved = () => setSavedSlugs(retainPublishedMaterials(readSavedMaterials()));
    const updateCompared = () => setCompareSlugs(retainPublishedMaterials(readComparedMaterials()));
    const updateCollections = () => {
      updateSaved();
      updateCompared();
    };

    updateCollections();
    window.addEventListener("storage", updateCollections);
    window.addEventListener(MATERIAL_SAVED_EVENT, updateSaved);
    window.addEventListener(MATERIAL_COMPARE_EVENT, updateCompared);

    return () => {
      window.removeEventListener("storage", updateCollections);
      window.removeEventListener(MATERIAL_SAVED_EVENT, updateSaved);
      window.removeEventListener(MATERIAL_COMPARE_EVENT, updateCompared);
    };
  }, []);

  const savedSet = useMemo(() => new Set(savedSlugs), [savedSlugs]);
  const compareSet = useMemo(() => new Set(compareSlugs), [compareSlugs]);
  const visibleMaterials = savedOnly
    ? materials.filter((material) => savedSet.has(material.slug))
    : materials;
  const compareMaterials = compareSlugs.flatMap((slug) => {
    const material = materialBySlug.get(slug);
    return material ? [material] : [];
  });
  const quickViewMaterial = quickViewSlug ? materialBySlug.get(quickViewSlug) ?? null : null;

  function toggleSaved(slug: string) {
    const result = toggleSavedMaterial(slug);
    const materialName = materialBySlug.get(slug)?.name ?? slug;
    setSavedSlugs(retainPublishedMaterials(result.slugs));
    setAnnouncement(
      result.saved
        ? `„${materialName}“ išsaugotas atrankoje.`
        : `„${materialName}“ pašalintas iš atrankos.`,
    );
  }

  function toggleCompare(slug: string) {
    const result = toggleComparedMaterial(slug);
    const materialName = materialBySlug.get(slug)?.name ?? slug;
    setCompareSlugs(retainPublishedMaterials(result.slugs));

    if (result.limitReached) {
      setAnnouncement("Vienu metu galima palyginti abi viešai pristatomas medžiagų kryptis.");
      return;
    }

    setAnnouncement(
      result.compared
        ? `„${materialName}“ pridėtas į palyginimą.`
        : `„${materialName}“ pašalintas iš palyginimo.`,
    );
  }

  function openQuickView(slug: string, trigger: HTMLButtonElement) {
    quickViewTriggerRef.current = trigger;
    setQuickViewSlug(slug);
  }

  function closeQuickView() {
    setQuickViewSlug(null);
    window.requestAnimationFrame(() => quickViewTriggerRef.current?.focus());
  }

  return (
    <div className="materials-page">
      <section className="materials-hero" aria-labelledby="materials-title">
        <div className="materials-hero__media" aria-hidden="true">
          <Image alt="" fill loading="eager" priority sizes="100vw" src={heroMaterial.localPath} />
        </div>
        <div className="materials-hero__scrim" />

        <div className="materials-hero__content content-shell">
          <div className="materials-hero__copy">
            <p className="eyebrow">Akmendarba medžiagos</p>
            <h1 id="materials-title">Akmens pasirinkimas.</h1>
            <p>
              Akmendarba viešai pristato granitą ir marmurą. Išsaugokite dominančią medžiagos kryptį arba palyginkite abi vienoje vietoje.
            </p>
          </div>

          <nav className="materials-hero__index" aria-label="Viešai pristatomos medžiagos">
            {materials.map((material) => (
              <a href={`#medziaga-${material.slug}`} key={material.slug}>
                <strong>{material.name}</strong>
              </a>
            ))}
          </nav>

          <a className="materials-hero__scroll" href="#pasirinkimas">
            Peržiūrėti pasirinkimą <ArrowDown aria-hidden="true" size={17} />
          </a>
        </div>
      </section>

      <section className="materials-explorer" id="pasirinkimas" aria-labelledby="collection-title">
        <div className="materials-explorer__intro content-shell">
          <div>
            <span className="eyebrow">Pradinė atranka</span>
            <h2 id="collection-title" tabIndex={-1}>Dvi viešai pristatomos kryptys.</h2>
          </div>
          <p>
            Tai nėra sandėlio likučių ar konkrečių akmens pavadinimų katalogas. Tikslų variantą, jo vaizdą ir prieinamumą patvirtinkite tiesiogiai su Akmendarba.
          </p>
        </div>

        <div className="material-selection-toolbar">
          <div className="material-selection-toolbar__inner content-shell">
            <p aria-live="polite" aria-atomic="true">
              Rodoma <strong>{visibleMaterials.length}</strong> iš {materials.length}
            </p>
            <button
              className="saved-only-toggle"
              type="button"
              data-active={savedOnly || undefined}
              onClick={() => setSavedOnly((current) => !current)}
              aria-pressed={savedOnly}
            >
              <Heart aria-hidden="true" fill={savedOnly ? "currentColor" : "none"} size={17} strokeWidth={1.5} />
              <span>{savedOnly ? "Rodomos išsaugotos" : "Rodyti išsaugotas"}</span>
              <small>{savedSlugs.length}</small>
            </button>
          </div>
        </div>

        <div className="material-results content-shell">
          <header className="material-results__header">
            <span>Pasirinkite širdelę, kad išsaugotumėte</span>
            <span>Pasirinkite palyginimo ženklą, kad sugretintumėte</span>
          </header>

          {visibleMaterials.length > 0 ? (
            <div className="material-gallery material-gallery--directions" data-count={visibleMaterials.length}>
              {visibleMaterials.map((material, index) => (
                <MaterialPlate
                  compareLimitReached={compareSlugs.length >= MAXIMUM_COMPARED_MATERIALS}
                  compared={compareSet.has(material.slug)}
                  key={material.slug}
                  material={material}
                  onQuickView={openQuickView}
                  onToggleCompare={toggleCompare}
                  onToggleSaved={toggleSaved}
                  position={index}
                  saved={savedSet.has(material.slug)}
                />
              ))}
            </div>
          ) : (
            <div className="material-empty-state">
              <div>
                <h3>Dar neišsaugojote nė vienos krypties.</h3>
                <p>Grįžkite į abi medžiagas ir širdelės mygtuku pažymėkite granitą arba marmurą.</p>
                <button className="button button--primary" type="button" onClick={() => setSavedOnly(false)}>
                  <RotateCcw aria-hidden="true" size={17} />
                  Rodyti abi medžiagas
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <aside className="materials-closing-note section--inverse">
        <div className="content-shell">
          <span className="eyebrow">Prieš užsakymą</span>
          <p>Konkrečią akmens rūšį ir jos prieinamumą patvirtinkite su Akmendarba.</p>
          <Link className="button button--inverse" href="/kontaktai">
            Susisiekti dėl pasirinkimo
          </Link>
        </div>
      </aside>

      <MaterialQuickView
        categoryName="Medžiagos kryptis"
        compareLimitReached={compareSlugs.length >= MAXIMUM_COMPARED_MATERIALS}
        compared={Boolean(quickViewMaterial && compareSet.has(quickViewMaterial.slug))}
        material={quickViewMaterial}
        onDismiss={closeQuickView}
        onToggleCompare={toggleCompare}
        onToggleSaved={toggleSaved}
        saved={Boolean(quickViewMaterial && savedSet.has(quickViewMaterial.slug))}
      />

      <MaterialCompare
        materials={compareMaterials}
        maximum={MAXIMUM_COMPARED_MATERIALS}
        onClear={() => setCompareSlugs(writeComparedMaterials([]))}
        onRemove={toggleCompare}
      />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
