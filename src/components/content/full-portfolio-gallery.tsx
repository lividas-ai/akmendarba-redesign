"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getPortfolioItems,
  portfolioCategories,
  type PortfolioCategorySlug,
  type PortfolioItem,
} from "@/data/portfolio-gallery";
import styles from "./full-portfolio-gallery.module.css";

type GalleryFilter = PortfolioCategorySlug | "visi";

type FullPortfolioGalleryProps = {
  className?: string;
  initialCategory?: GalleryFilter;
  showIntro?: boolean;
};

const initialVisibleItems = 18;
const additionalVisibleItems = 18;

const filters: readonly { slug: GalleryFilter; label: string }[] = [
  { slug: "visi", label: "Visi darbai" },
  ...portfolioCategories.map(({ slug, label }) => ({ slug, label })),
];

function joinClassNames(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export function FullPortfolioGallery({
  className,
  initialCategory = "visi",
  showIntro = true,
}: FullPortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryFilter>(initialCategory);
  const [visibleLimit, setVisibleLimit] = useState(initialVisibleItems);
  const [activeItemSlug, setActiveItemSlug] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const filteredItems = useMemo(() => getPortfolioItems(activeCategory), [activeCategory]);
  const visibleItems = filteredItems.slice(0, visibleLimit);
  const activeItemIndex = activeItemSlug
    ? filteredItems.findIndex((item) => item.slug === activeItemSlug)
    : -1;
  const activeItem = activeItemIndex >= 0 ? filteredItems[activeItemIndex] : null;
  const activeCategoryDescription =
    activeCategory === "visi"
      ? "Tikri Granit Decor darbai skirtingoms vidaus ir lauko erdvėms."
      : portfolioCategories.find((category) => category.slug === activeCategory)?.description;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeItem && dialog && !dialog.open) dialog.showModal();
  }, [activeItem]);

  function chooseCategory(category: GalleryFilter) {
    dialogRef.current?.close();
    setActiveCategory(category);
    setVisibleLimit(initialVisibleItems);
  }

  function openItem(item: PortfolioItem, opener: HTMLButtonElement) {
    openerRef.current = opener;
    setActiveItemSlug(item.slug);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    setActiveItemSlug(null);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }

  function showAdjacentItem(direction: -1 | 1) {
    if (!filteredItems.length || activeItemIndex < 0) return;
    const nextIndex = (activeItemIndex + direction + filteredItems.length) % filteredItems.length;
    setActiveItemSlug(filteredItems[nextIndex].slug);
  }

  return (
    <div className={joinClassNames(styles.root, className)}>
      {showIntro ? (
        <div className={styles.intro}>
          <div>
            <span className="eyebrow">Darbų galerija</span>
            <h2>Akmuo tikrose erdvėse</h2>
          </div>
          <p>
            Visa viešai pristatoma Granit Decor darbų kolekcija — nuo virtuvės ir vonios stalviršių iki
            laiptų, lauko elementų bei židinių.
          </p>
        </div>
      ) : null}

      <div className={styles.filterDock}>
        <div className={styles.filters} aria-label="Filtruoti Granit Decor darbų galeriją" role="group">
          {filters.map((filter) => (
            <button
              aria-pressed={activeCategory === filter.slug}
              className={styles.filterButton}
              key={filter.slug}
              onClick={() => chooseCategory(filter.slug)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.context}>
        <p>{activeCategoryDescription}</p>
        <span aria-live="polite" className="sr-only">
          Pasirinkta galerija: {filters.find((filter) => filter.slug === activeCategory)?.label}.
        </span>
      </div>

      <ul className={styles.grid}>
        {visibleItems.map((item) => (
          <li className={styles.gridItem} key={item.slug}>
            <figure className={styles.figure}>
              <button
                aria-label={`Atverti nuotrauką: ${item.alt}`}
                className={styles.imageButton}
                onClick={(event) => openItem(item, event.currentTarget)}
                type="button"
              >
                <span className={styles.imageFrame}>
                  <Image
                    alt={item.alt}
                    className={styles.image}
                    fill
                    loading="lazy"
                    sizes="(min-width: 72rem) 55vw, (min-width: 34rem) 50vw, 100vw"
                    src={item.localPath}
                  />
                </span>
                <span aria-hidden="true" className={styles.imageOverlay}>
                  <span>{item.categoryLabel}</span>
                  <Maximize2 size={20} strokeWidth={1.5} />
                </span>
              </button>
              <figcaption className="sr-only">{item.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {visibleLimit < filteredItems.length ? (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreButton}
            onClick={() => setVisibleLimit((currentLimit) => currentLimit + additionalVisibleItems)}
            type="button"
          >
            Rodyti daugiau darbų
          </button>
        </div>
      ) : null}

      <dialog
        aria-label={activeItem ? `${activeItem.categoryLabel} darbų nuotrauka` : "Darbų nuotrauka"}
        className={styles.dialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onClose={handleDialogClose}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            showAdjacentItem(-1);
          }

          if (event.key === "ArrowRight") {
            event.preventDefault();
            showAdjacentItem(1);
          }
        }}
        ref={dialogRef}
      >
        {activeItem ? (
          <div className={styles.dialogPanel}>
            <div className={styles.dialogMedia}>
              <Image
                alt={activeItem.alt}
                className={styles.dialogImage}
                fill
                priority
                sizes="96vw"
                src={activeItem.localPath}
              />
            </div>

            <div className={styles.dialogCaption}>
              <strong>{activeItem.categoryLabel}</strong>
              <p>{activeItem.caption}</p>
            </div>

            <button aria-label="Uždaryti nuotrauką" className={styles.dialogClose} onClick={closeDialog} type="button">
              <X size={24} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Ankstesnė nuotrauka"
              className={joinClassNames(styles.dialogNavigation, styles.dialogPrevious)}
              onClick={() => showAdjacentItem(-1)}
              type="button"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Kita nuotrauka"
              className={joinClassNames(styles.dialogNavigation, styles.dialogNext)}
              onClick={() => showAdjacentItem(1)}
              type="button"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
