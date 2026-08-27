"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { materialCategories } from "@/client/content";
import {
  navigationSearchIndex,
  type NavigationSearchGroup,
  type NavigationSearchItem,
} from "@/client/navigation";

type SiteSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SearchItem = NavigationSearchItem;

type SearchGroup = {
  id: string;
  label: string;
  items: readonly SearchItem[];
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("lt-LT")
    .trim();

const defaultGroups: readonly SearchGroup[] = [
  {
    id: "pradeti",
    label: "Dažniausiai ieškoma",
    items: [
      navigationSearchIndex.find((item) => item.id === "application-virtuves-stalvirsiai"),
      navigationSearchIndex.find((item) => item.id === "application-vonios-stalvirsiai"),
      navigationSearchIndex.find((item) => item.id === "application-laiptai-ir-laiptu-pakopos"),
      navigationSearchIndex.find((item) => item.id === "projekto-planas"),
    ].filter((item): item is SearchItem => Boolean(item)),
  },
  {
    id: "akmens-rusys",
    label: "Akmens rūšys",
    items: materialCategories.map((category) => ({
      id: category.id,
      label: category.name,
      href: category.href,
      group: "akmuo" as const,
      keywords: [category.visualCharacter],
    })),
  },
];

function filterItems(items: readonly SearchItem[], query: string, limit: number) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  return items
    .filter((item) => {
      const haystack = normalize(`${item.label} ${item.keywords.join(" ")}`);
      return terms.every((term) => haystack.includes(term));
    })
    .slice(0, limit);
}

export function SiteSearchDialog({ open, onOpenChange }: SiteSearchDialogProps) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  const groups = useMemo<readonly SearchGroup[]>(() => {
    if (!query.trim()) return defaultGroups;

    const byGroup = (group: NavigationSearchGroup) =>
      navigationSearchIndex.filter((item) => item.group === group);

    return [
      { id: "gaminiai", label: "Gaminiai", items: filterItems(byGroup("gaminiai"), query, 6) },
      { id: "akmuo", label: "Akmuo", items: filterItems(byGroup("akmuo"), query, 8) },
      { id: "projektai", label: "Projektai", items: filterItems(byGroup("projektai"), query, 4) },
      {
        id: "puslapiai",
        label: "Puslapiai ir žurnalas",
        items: filterItems([...byGroup("puslapiai"), ...byGroup("zurnalas")], query, 6),
      },
    ].filter((group) => group.items.length > 0);
  }, [query]);

  const resultCount = groups.reduce((total, group) => total + group.items.length, 0);

  return (
    <dialog
      aria-label="Paieška svetainėje"
      className="site-search"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === dialogRef.current) onOpenChange(false);
      }}
      onKeyDownCapture={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        onOpenChange(false);
      }}
    >
      <div className="site-search__panel">
        <div className="site-search__top">
          <p>Paieška</p>
          <button aria-label="Uždaryti paiešką" type="button" onClick={() => onOpenChange(false)}>
            <X aria-hidden="true" size={22} strokeWidth={1.4} />
          </button>
        </div>

        <form className="site-search__form" role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="site-search-input">Ieškokite gaminio, akmens arba projekto</label>
          <div>
            <Search aria-hidden="true" size={22} strokeWidth={1.35} />
            <input
              autoComplete="off"
              id="site-search-input"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pvz., virtuvės stalviršis arba Patagonia"
              ref={inputRef}
              type="search"
              value={query}
            />
            {query ? (
              <button aria-label="Išvalyti paiešką" type="button" onClick={() => setQuery("")}>
                <X aria-hidden="true" size={18} strokeWidth={1.4} />
              </button>
            ) : null}
          </div>
        </form>

        <p className="sr-only" aria-live="polite">
          {query ? `Rasta rezultatų: ${resultCount}` : "Rodomos dažniausios nuorodos"}
        </p>

        <div className="site-search__results">
          {groups.length ? (
            groups.map((group) => (
              <section aria-labelledby={`site-search-${group.id}`} key={group.id}>
                <h2 id={`site-search-${group.id}`}>{group.label}</h2>
                <div>
                  {group.items.map((item) => (
                    <Link href={item.href} key={`${group.id}-${item.id}`} onClick={() => onOpenChange(false)}>
                      <span>{item.label}</span>
                      <ArrowRight aria-hidden="true" size={16} strokeWidth={1.4} />
                    </Link>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="site-search__empty">
              <h2>Nieko neradome</h2>
              <p>Patikrinkite rašybą arba ieškokite bendresnio žodžio.</p>
              <Link href="/gaminiai" onClick={() => onOpenChange(false)}>
                Peržiūrėti visus gaminius <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
