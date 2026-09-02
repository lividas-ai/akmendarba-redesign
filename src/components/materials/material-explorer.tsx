"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowDown, Heart, RotateCcw, Search, X } from "lucide-react";
import {
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  materialCollections,
  materials,
  type MaterialCategory,
} from "@/client/materials";
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

type CategoryFilter = "visi" | MaterialCategory;

const initialVisibleMaterials = 24;
const additionalVisibleMaterials = 24;
const materialBySlug = new Map(materials.map((material) => [material.slug, material]));
const materialSlugs = new Set(materialBySlug.keys());
const categoryIds = new Set<MaterialCategory>(
  materialCollections.map((collection) => collection.id),
);
const categoryCounts = Object.fromEntries(
  materialCollections.map((collection) => [
    collection.id,
    materials.filter((material) => material.category === collection.id).length,
  ]),
) as Record<MaterialCategory, number>;
const heroMaterial = materialBySlug.get("granito-blokai-ir-plokstes") ?? materials[0];

function MaterialSearchParamSync({ onChange }: { onChange: (search: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onChange(searchParams.toString());
  }, [onChange, searchParams]);

  return null;
}

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("lt-LT")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function isMaterialCategory(value: string | null): value is MaterialCategory {
  return Boolean(value && categoryIds.has(value as MaterialCategory));
}

function retainPublishedMaterials(slugs: readonly string[]) {
  return slugs.filter((slug) => materialSlugs.has(slug));
}

export function MaterialExplorer() {
  const [filterParams, setFilterParams] = useState(() => new URLSearchParams());
  const query = filterParams.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(initialVisibleMaterials);
  const quickViewTriggerRef = useRef<HTMLButtonElement | null>(null);
  const lastLocationSearchRef = useRef("");

  const typeParam = filterParams.get("tipas");
  const category: CategoryFilter = isMaterialCategory(typeParam) ? typeParam : "visi";
  const savedOnly = filterParams.get("rodyti") === "issaugoti";

  const syncFilterParams = useCallback((search: string) => {
    if (lastLocationSearchRef.current === search) return;
    lastLocationSearchRef.current = search;
    setVisibleLimit(initialVisibleMaterials);
    setFilterParams(new URLSearchParams(search));
  }, []);

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

  const replaceParams = useCallback(
    (changes: Readonly<Record<string, string | null>>) => {
      setVisibleLimit(initialVisibleMaterials);
      const next = new URLSearchParams(filterParams.toString());
      Object.entries(changes).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      const queryString = next.toString();
      lastLocationSearchRef.current = queryString;
      const nextUrl = queryString
        ? `${window.location.pathname}?${queryString}#pasirinkimas`
        : `${window.location.pathname}#pasirinkimas`;
      window.history.replaceState(null, "", nextUrl);
      setFilterParams(next);
    },
    [filterParams],
  );

  const savedSet = useMemo(() => new Set(savedSlugs), [savedSlugs]);
  const compareSet = useMemo(() => new Set(compareSlugs), [compareSlugs]);
  const visibleMaterials = useMemo(() => {
    const normalizedQuery = normalizeSearch(deferredQuery);

    return materials.filter((material) => {
      if (category !== "visi" && material.category !== category) return false;
      if (savedOnly && !savedSet.has(material.slug)) return false;
      if (!normalizedQuery) return true;

      return normalizeSearch(
        `${material.name} ${material.categoryName} ${material.sourceContext} ${material.sourceAssetName}`,
      ).includes(normalizedQuery);
    });
  }, [category, deferredQuery, savedOnly, savedSet]);
  const displayedMaterials = visibleMaterials.slice(0, visibleLimit);
  const compareMaterials = useMemo(
    () => compareSlugs.flatMap((slug) => {
      const material = materialBySlug.get(slug);
      return material ? [material] : [];
    }),
    [compareSlugs],
  );
  const quickViewMaterial = quickViewSlug ? materialBySlug.get(quickViewSlug) ?? null : null;
  const filtersActive = Boolean(query || category !== "visi" || savedOnly);

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
      setAnnouncement(`Vienu metu galima palyginti iki ${MAXIMUM_COMPARED_MATERIALS} pavyzdžių.`);
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

  function resetFilters() {
    replaceParams({ q: null, tipas: null, rodyti: null });
  }

  return (
    <div className="materials-page">
      <Suspense fallback={null}>
        <MaterialSearchParamSync onChange={syncFilterParams} />
      </Suspense>

      <section className="materials-hero" aria-labelledby="materials-title">
        <div className="materials-hero__media" aria-hidden="true">
          <Image alt="" fill loading="eager" priority sizes="100vw" src={heroMaterial.localPath} />
        </div>
        <div className="materials-hero__scrim" />

        <div className="materials-hero__content content-shell">
          <div className="materials-hero__copy">
            <p className="eyebrow">Visa Akmendarba kolekcija</p>
            <h1 id="materials-title">Akmuo ir atlikti darbai.</h1>
            <p>
              Vienoje vietoje peržiūrėkite visus viešai rodomus akmens, gamybos ir atliktų darbų pavyzdžius. Patikusius išsaugokite arba palyginkite iki trijų.
            </p>
          </div>

          <nav className="materials-hero__index" aria-label="Pavyzdžių kategorijos">
            {materialCollections.map((collection) => (
              <a href={`?tipas=${collection.id}#pasirinkimas`} key={collection.id}>
                <strong>{collection.shortName}</strong>
                <small>{categoryCounts[collection.id]}</small>
              </a>
            ))}
          </nav>

          <a className="materials-hero__scroll" href="#pasirinkimas">
            Peržiūrėti kolekciją <ArrowDown aria-hidden="true" size={17} />
          </a>
        </div>
      </section>

      <section className="materials-explorer" id="pasirinkimas" aria-labelledby="collection-title">
        <div className="materials-explorer__intro content-shell">
          <div>
            <span className="eyebrow">Viešų šaltinių kolekcija</span>
            <h2 id="collection-title" tabIndex={-1}>Visi pavyzdžiai vienoje atrankoje.</h2>
          </div>
          <p>
            Akmendarba viešai neskelbia atskiro akmens likučių ar pavadintų plokščių katalogo. Todėl čia pateikiami tik jų svetainėje iš tikrųjų rodomi medžiagos ir atliktų darbų vaizdai — be išgalvotų pavadinimų, savybių ar kainų.
          </p>
        </div>

        <div className="material-filter-bar">
          <div className="material-filter-bar__inner content-shell">
            <form className="material-search" role="search" onSubmit={(event) => event.preventDefault()}>
              <Search aria-hidden="true" size={18} strokeWidth={1.5} />
              <label className="sr-only" htmlFor="material-search-input">
                Ieškoti pavyzdžių
              </label>
              <input
                id="material-search-input"
                type="search"
                inputMode="search"
                autoComplete="off"
                value={query}
                onChange={(event) => replaceParams({ q: event.target.value.trim() ? event.target.value : null })}
                placeholder="Ieškoti pavyzdžių…"
              />
              {query ? (
                <button type="button" onClick={() => replaceParams({ q: null })} aria-label="Išvalyti paiešką">
                  <X aria-hidden="true" size={17} strokeWidth={1.6} />
                </button>
              ) : null}
            </form>

            <div className="material-filter-tools material-filter-tools--single">
              <button
                className="saved-only-toggle"
                type="button"
                data-active={savedOnly || undefined}
                onClick={() => replaceParams({ rodyti: savedOnly ? null : "issaugoti" })}
                aria-pressed={savedOnly}
              >
                <Heart aria-hidden="true" fill={savedOnly ? "currentColor" : "none"} size={17} strokeWidth={1.5} />
                <span>{savedOnly ? "Rodomi išsaugoti" : "Rodyti išsaugotus"}</span>
                <small>{savedSlugs.length}</small>
              </button>
            </div>

            <div className="material-category-filters" aria-label="Filtruoti pagal pavyzdžio kategoriją">
              <button
                type="button"
                data-active={category === "visi" || undefined}
                onClick={() => replaceParams({ tipas: null })}
                aria-pressed={category === "visi"}
              >
                Visi <span>{materials.length}</span>
              </button>
              {materialCollections.map((collection) => (
                <button
                  type="button"
                  key={collection.id}
                  data-active={category === collection.id || undefined}
                  onClick={() => replaceParams({ tipas: category === collection.id ? null : collection.id })}
                  aria-pressed={category === collection.id}
                >
                  {collection.shortName} <span>{categoryCounts[collection.id]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="material-results content-shell">
          <header className="material-results__header">
            <p aria-live="polite" aria-atomic="true">
              Rasta <strong>{visibleMaterials.length}</strong> iš {materials.length}
            </p>
            {filtersActive ? (
              <button type="button" onClick={resetFilters}>
                <RotateCcw aria-hidden="true" size={15} strokeWidth={1.7} />
                Atkurti visą kolekciją
              </button>
            ) : (
              <span>Pasirinkite vaizdą detalesnei peržiūrai</span>
            )}
          </header>

          {visibleMaterials.length > 0 ? (
            <>
              <div className="material-gallery" data-count={displayedMaterials.length}>
                {displayedMaterials.map((material, index) => (
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

              {displayedMaterials.length < visibleMaterials.length ? (
                <div className="material-gallery-progress">
                  <p>
                    Rodoma <strong>{displayedMaterials.length}</strong> iš {visibleMaterials.length}
                  </p>
                  <span aria-hidden="true">
                    <i style={{ width: `${(displayedMaterials.length / visibleMaterials.length) * 100}%` }} />
                  </span>
                  <button
                    className="button button--secondary"
                    onClick={() => setVisibleLimit((current) => current + additionalVisibleMaterials)}
                    type="button"
                  >
                    Rodyti daugiau <ArrowDown aria-hidden="true" size={17} />
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="material-empty-state">
              <div>
                <h3>Pavyzdžių nerasta.</h3>
                <p>Pakeiskite paiešką arba grįžkite į visą kolekciją.</p>
                <button className="button button--primary" type="button" onClick={resetFilters}>
                  <RotateCcw aria-hidden="true" size={17} />
                  Rodyti visus pavyzdžius
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <aside className="materials-closing-note section--inverse">
        <div className="content-shell">
          <span className="eyebrow">Svarbu renkantis</span>
          <p>Nuotrauka padeda atsirinkti kryptį. Galutinį akmenį patvirtina Akmendarba.</p>
          <Link className="button button--inverse" href="/kontaktai">
            Aptarti pasirinkimą
          </Link>
        </div>
      </aside>

      <MaterialQuickView
        categoryName={quickViewMaterial?.categoryName ?? ""}
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
