"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDown,
  Heart,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import { materialCategories } from "@/data/content";
import {
  materials,
  type Material,
  type MaterialCategory,
} from "@/data/materials";
import {
  MATERIAL_SAVED_EVENT,
  readSavedMaterials,
  toggleSavedMaterial,
} from "@/lib/material-storage";
import { MaterialCompare } from "@/components/materials/material-compare";
import { MaterialPlate } from "@/components/materials/material-plate";
import { MaterialQuickView } from "@/components/materials/material-quick-view";

type CategoryFilter = "visi" | MaterialCategory;
type SortMode = "az" | "za" | "saved";

const categoryNames = Object.fromEntries(
  materialCategories.map((category) => [category.id, category.name]),
) as Record<MaterialCategory, string>;

const categoryIds = new Set<MaterialCategory>(
  materialCategories.map((category) => category.id),
);

const materialBySlug = new Map(materials.map((material) => [material.slug, material]));

const categoryCounts = materials.reduce<Record<MaterialCategory, number>>(
  (counts, material) => {
    counts[material.category] += 1;
    return counts;
  },
  { granitas: 0, marmuras: 0, kvarcitas: 0, oniksas: 0, travertinas: 0 },
);

const heroMaterial = materialBySlug.get("patagonia") ?? materials[0];

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

function isSortMode(value: string | null): value is SortMode {
  return value === "az" || value === "za" || value === "saved";
}

export function MaterialExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setOptimisticQuery] = useOptimistic(urlQuery);
  const deferredQuery = useDeferredValue(query);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const quickViewTriggerRef = useRef<HTMLButtonElement | null>(null);

  const typeParam = searchParams.get("tipas");
  const category: CategoryFilter = isMaterialCategory(typeParam) ? typeParam : "visi";
  const sortParam = searchParams.get("rikiuoti");
  const sortMode: SortMode = isSortMode(sortParam) ? sortParam : "az";
  const savedOnly = searchParams.get("rodyti") === "issaugoti";

  useEffect(() => {
    const updateSaved = () => setSavedSlugs(readSavedMaterials());
    updateSaved();
    window.addEventListener("storage", updateSaved);
    window.addEventListener(MATERIAL_SAVED_EVENT, updateSaved);

    return () => {
      window.removeEventListener("storage", updateSaved);
      window.removeEventListener(MATERIAL_SAVED_EVENT, updateSaved);
    };
  }, []);

  const replaceParams = useCallback(
    (changes: Readonly<Record<string, string | null>>, optimisticQuery?: string) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(changes).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      const queryString = next.toString();

      startTransition(() => {
        if (optimisticQuery !== undefined) setOptimisticQuery(optimisticQuery);
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams, setOptimisticQuery],
  );

  function handleSearch(value: string) {
    replaceParams({ q: value.trim() ? value : null }, value);
  }

  const savedSet = useMemo(() => new Set(savedSlugs), [savedSlugs]);
  const compareSet = useMemo(() => new Set(compareSlugs), [compareSlugs]);

  const visibleMaterials = useMemo(() => {
    const normalizedQuery = normalizeSearch(deferredQuery);
    const result: Material[] = [];

    for (const material of materials) {
      if (category !== "visi" && material.category !== category) continue;
      if (savedOnly && !savedSet.has(material.slug)) continue;

      if (normalizedQuery) {
        const searchable = normalizeSearch(`${material.name} ${categoryNames[material.category]}`);
        if (!searchable.includes(normalizedQuery)) continue;
      }

      result.push(material);
    }

    result.sort((left, right) => {
      if (sortMode === "saved") {
        const savedDifference = Number(savedSet.has(right.slug)) - Number(savedSet.has(left.slug));
        if (savedDifference !== 0) return savedDifference;
      }

      const direction = sortMode === "za" ? -1 : 1;
      return direction * left.name.localeCompare(right.name, "lt-LT", { sensitivity: "base" });
    });

    return result;
  }, [category, deferredQuery, savedOnly, savedSet, sortMode]);

  const compareMaterials = useMemo(
    () => compareSlugs.flatMap((slug) => {
      const material = materialBySlug.get(slug);
      return material ? [material] : [];
    }),
    [compareSlugs],
  );

  const quickViewMaterial = quickViewSlug ? materialBySlug.get(quickViewSlug) ?? null : null;
  const filtersActive = Boolean(query || category !== "visi" || savedOnly || sortMode !== "az");

  function toggleSaved(slug: string) {
    const result = toggleSavedMaterial(slug);
    const materialName = materialBySlug.get(slug)?.name ?? slug;
    setSavedSlugs(result.slugs);
    setAnnouncement(result.saved ? `„${materialName}“ išsaugotas.` : `„${materialName}“ pašalintas iš išsaugotų.`);
  }

  function toggleCompare(slug: string) {
    const materialName = materialBySlug.get(slug)?.name ?? slug;
    setCompareSlugs((current) => {
      if (current.includes(slug)) {
        setAnnouncement(`„${materialName}“ pašalintas iš palyginimo.`);
        return current.filter((item) => item !== slug);
      }

      if (current.length >= 3) {
        setAnnouncement("Vienu metu galima palyginti iki 3 akmenų.");
        return current;
      }

      setAnnouncement(`„${materialName}“ pridėtas į palyginimą.`);
      return [...current, slug];
    });
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
    replaceParams({ q: null, tipas: null, rikiuoti: null, rodyti: null }, "");
  }

  return (
    <div className="materials-page">
      <section className="materials-hero" aria-labelledby="materials-title">
        <div className="materials-hero__media" aria-hidden="true">
          <Image
            alt=""
            fill
            loading="eager"
            priority
            sizes="100vw"
            src={heroMaterial.localPath}
          />
        </div>
        <div className="materials-hero__scrim" />

        <div className="materials-hero__content content-shell">
          <div className="materials-hero__copy">
            <p className="eyebrow">Natūralaus akmens katalogas</p>
            <h1 id="materials-title">Akmens atlasas.</h1>
            <p>
              Tyrinėkite raštą, spalvą ir vizualų charakterį. Išsaugokite patikusius variantus arba palyginkite iki trijų akmenų vienoje vietoje.
            </p>
          </div>

          <nav className="materials-hero__index" aria-label="Akmens rūšys">
            {materialCategories.map((item) => (
              <Link href={`${item.href}#kolekcija`} key={item.id}>
                <strong>{item.name}</strong>
              </Link>
            ))}
          </nav>

          <a className="materials-hero__scroll" href="#kolekcija">
            Tyrinėti kolekciją <ArrowDown aria-hidden="true" size={17} />
          </a>
        </div>
      </section>

      <section className="materials-explorer" id="kolekcija" aria-labelledby="collection-title">
        <div className="materials-explorer__intro content-shell">
          <div>
            <span className="eyebrow">Kolekcija</span>
            <h2 id="collection-title">Raskite savo projekto pradžią.</h2>
          </div>
          <p>
            Mažas vaizdas neperteikia visos natūralaus akmens plokštės. Ši kolekcija skirta pradinei atrankai — konkretų raštą ir atspalvį patvirtinkite projekto aptarimo metu.
          </p>
        </div>

        <div className="material-filter-bar">
          <div className="material-filter-bar__inner content-shell">
            <form className="material-search" role="search" onSubmit={(event) => event.preventDefault()}>
              <Search aria-hidden="true" size={18} strokeWidth={1.5} />
              <label className="sr-only" htmlFor="material-search-input">
                Ieškoti pagal akmens pavadinimą
              </label>
              <input
                id="material-search-input"
                type="search"
                inputMode="search"
                autoComplete="off"
                value={query}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Ieškoti pavadinimo…"
              />
              {query ? (
                <button type="button" onClick={() => handleSearch("")} aria-label="Išvalyti paiešką">
                  <X aria-hidden="true" size={17} strokeWidth={1.6} />
                </button>
              ) : null}
            </form>

            <div className="material-filter-tools">
              <label className="material-sort">
                <SlidersHorizontal aria-hidden="true" size={17} strokeWidth={1.5} />
                <span className="sr-only">Rikiavimas</span>
                <select
                  value={sortMode}
                  onChange={(event) => replaceParams({ rikiuoti: event.target.value === "az" ? null : event.target.value })}
                >
                  <option value="az">Pavadinimas A–Ž</option>
                  <option value="za">Pavadinimas Ž–A</option>
                  <option value="saved">Išsaugoti pirmiausia</option>
                </select>
              </label>
              <button
                className="saved-only-toggle"
                type="button"
                data-active={savedOnly || undefined}
                onClick={() => replaceParams({ rodyti: savedOnly ? null : "issaugoti" })}
                aria-pressed={savedOnly}
              >
                <Heart aria-hidden="true" fill={savedOnly ? "currentColor" : "none"} size={17} strokeWidth={1.5} />
                <span>Išsaugoti</span>
                <small>{savedSlugs.length}</small>
              </button>
            </div>

            <div className="material-category-filters" aria-label="Filtruoti pagal akmens rūšį">
              <button
                type="button"
                data-active={category === "visi" || undefined}
                onClick={() => replaceParams({ tipas: null })}
                aria-pressed={category === "visi"}
              >
                Visi <span>{materials.length}</span>
              </button>
              {materialCategories.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  data-active={category === item.id || undefined}
                  onClick={() => replaceParams({ tipas: category === item.id ? null : item.id })}
                  aria-pressed={category === item.id}
                >
                  {item.name} <span>{categoryCounts[item.id]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="material-results content-shell">
          <header className="material-results__header">
            <p aria-live="polite" aria-atomic="true">
              Rodoma <strong>{visibleMaterials.length}</strong> iš {materials.length}
            </p>
            {filtersActive ? (
              <button type="button" onClick={resetFilters}>
                <RotateCcw aria-hidden="true" size={15} strokeWidth={1.7} />
                Atkurti visą kolekciją
              </button>
            ) : (
              <span>Pasirinkite akmenį detalesnei peržiūrai</span>
            )}
          </header>

          {visibleMaterials.length > 0 ? (
            <div className="material-gallery" data-count={visibleMaterials.length}>
              {visibleMaterials.map((material, index) => (
                <MaterialPlate
                  compareLimitReached={compareSlugs.length >= 3}
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
                <h3>Nerasta nė vieno akmens.</h3>
                <p>
                  Pakeiskite paieškos žodį arba grįžkite į visą kolekciją. Jei įjungtas išsaugotų filtras, pirmiausia išsaugokite bent vieną variantą.
                </p>
                <button className="button button--primary" type="button" onClick={resetFilters}>
                  <RotateCcw aria-hidden="true" size={17} />
                  Rodyti visus akmenis
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <aside className="materials-closing-note section--inverse">
        <div className="content-shell">
          <span className="eyebrow">Svarbu renkantis</span>
          <p>Nuotrauka yra pradžia. Sprendimas priimamas pamačius visą plokštę.</p>
          <Link className="button button--inverse" href="/projektas">
            Aptarti akmens pasirinkimą
          </Link>
        </div>
      </aside>

      <MaterialQuickView
        categoryName={quickViewMaterial ? categoryNames[quickViewMaterial.category] : ""}
        compareLimitReached={compareSlugs.length >= 3}
        compared={Boolean(quickViewMaterial && compareSet.has(quickViewMaterial.slug))}
        material={quickViewMaterial}
        onDismiss={closeQuickView}
        onToggleCompare={toggleCompare}
        onToggleSaved={toggleSaved}
        saved={Boolean(quickViewMaterial && savedSet.has(quickViewMaterial.slug))}
      />

      <MaterialCompare
        categoryNames={categoryNames}
        materials={compareMaterials}
        onClear={() => setCompareSlugs([])}
        onRemove={toggleCompare}
      />

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
