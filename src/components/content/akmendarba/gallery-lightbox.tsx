"use client";

import Image, { type ImageProps } from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type AkGalleryItem = {
  src: ImageProps["src"];
  alt: string;
};

type GalleryLightboxProps = {
  items: readonly AkGalleryItem[];
  className?: string;
};

function joinClassNames(...classNames: Array<string | undefined | false>) {
  return classNames.filter(Boolean).join(" ");
}

export function GalleryLightbox({ items, className }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = activeIndex !== null;
  const activeItem = activeIndex === null ? null : (items[activeIndex] ?? null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && dialog?.isConnected && !dialog.open) {
      dialog.showModal();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  useEffect(() => {
    if (activeIndex !== null && !activeItem) dialogRef.current?.close();
  }, [activeIndex, activeItem]);

  function openItem(index: number, opener: HTMLButtonElement) {
    openerRef.current = opener;
    setActiveIndex(index);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    setActiveIndex(null);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }

  function showAdjacentItem(direction: -1 | 1) {
    if (items.length < 2) return;

    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return (currentIndex + direction + items.length) % items.length;
    });
  }

  return (
    <>
      <ul className={joinClassNames("ak-gallery", className)}>
        {items.map((item, index) => (
          <li className="ak-gallery__item" key={`${item.alt}-${index}`}>
            <figure className="ak-gallery__figure">
              <button
                aria-label={`Atverti nuotrauką: ${item.alt}`}
                className="ak-gallery__trigger"
                onClick={(event) => openItem(index, event.currentTarget)}
                type="button"
              >
                <span className="ak-gallery__media">
                  <Image
                    alt={item.alt}
                    className="ak-gallery__image"
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    sizes="(min-width: 80rem) 32vw, (min-width: 48rem) 48vw, 100vw"
                    src={item.src}
                  />
                </span>
                <span aria-hidden="true" className="ak-gallery__affordance">
                  <Maximize2 size={20} strokeWidth={1.4} />
                </span>
              </button>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        aria-label="Nuotraukų peržiūra"
        className="ak-gallery-lightbox"
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onClose={handleDialogClose}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeDialog();
          }

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
          <div className="ak-gallery-lightbox__panel">
            <div className="ak-gallery-lightbox__stage">
              <Image
                alt={activeItem.alt}
                className="ak-gallery-lightbox__image"
                fill
                priority
                sizes="100vw"
                src={activeItem.src}
              />
            </div>

            <p aria-live="polite" className="sr-only">
              {activeItem.alt}
            </p>

            <button
              aria-label="Uždaryti nuotrauką"
              className="ak-gallery-lightbox__close"
              onClick={closeDialog}
              type="button"
            >
              <X aria-hidden="true" size={24} strokeWidth={1.4} />
            </button>

            {items.length > 1 ? (
              <>
                <button
                  aria-label="Ankstesnė nuotrauka"
                  className="ak-gallery-lightbox__navigation ak-gallery-lightbox__navigation--previous"
                  onClick={() => showAdjacentItem(-1)}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={30} strokeWidth={1.4} />
                </button>
                <button
                  aria-label="Kita nuotrauka"
                  className="ak-gallery-lightbox__navigation ak-gallery-lightbox__navigation--next"
                  onClick={() => showAdjacentItem(1)}
                  type="button"
                >
                  <ChevronRight aria-hidden="true" size={30} strokeWidth={1.4} />
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
