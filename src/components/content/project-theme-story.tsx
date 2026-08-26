"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ProjectThemeImage, ProjectThemeStory as ProjectThemeStoryData } from "@/data/project-themes";
import styles from "./project-theme-story.module.css";

type ProjectThemeStoryProps = {
  story: ProjectThemeStoryData;
};

type ActiveImage = ProjectThemeImage & {
  chapterTitle: string;
};

export function ProjectThemeStory({ story }: ProjectThemeStoryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [activeSourceAssetId, setActiveSourceAssetId] = useState<string | null>(null);
  const images = useMemo<readonly ActiveImage[]>(
    () =>
      story.chapters.flatMap((chapter) =>
        chapter.images.map((image) => ({ ...image, chapterTitle: chapter.title })),
      ),
    [story],
  );
  const activeIndex = activeSourceAssetId
    ? images.findIndex((image) => image.sourceAssetId === activeSourceAssetId)
    : -1;
  const activeImage = activeIndex >= 0 ? images[activeIndex] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeImage && dialog && !dialog.open) dialog.showModal();
  }, [activeImage]);

  function openImage(image: ProjectThemeImage, opener: HTMLButtonElement) {
    openerRef.current = opener;
    setActiveSourceAssetId(image.sourceAssetId);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    setActiveSourceAssetId(null);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }

  function showAdjacentImage(direction: -1 | 1) {
    if (activeIndex < 0 || images.length === 0) return;
    const nextIndex = (activeIndex + direction + images.length) % images.length;
    setActiveSourceAssetId(images[nextIndex].sourceAssetId);
  }

  return (
    <section className={styles.root} aria-labelledby="project-theme-title">
      <header className={`content-shell ${styles.intro}`}>
        <div className={styles.introHeading}>
          <span className="eyebrow">Darbų archyvas · teminė atranka</span>
          <h2 id="project-theme-title">{story.title}</h2>
        </div>
        <div className={styles.introCopy}>
          <p>{story.introduction}</p>
          <p className={styles.provenance}>
            Skirtingų Granit Decor darbų vaizdai, atrinkti pagal erdvę ir akmens sprendimo charakterį.
          </p>
        </div>
      </header>

      <div className={styles.chapters}>
        {story.chapters.map((chapter, chapterIndex) => (
          <section className={`content-shell ${styles.chapter}`} key={chapter.id}>
            <header className={styles.chapterHeader}>
              <div>
                <span className="eyebrow">{chapter.eyebrow}</span>
                <h3>{chapter.title}</h3>
              </div>
              <p>{chapter.body}</p>
            </header>

            <ul className={styles.grid} data-direction={chapterIndex % 2 === 0 ? "forward" : "reverse"} data-project-gallery>
              {chapter.images.map((image, imageIndex) => (
                <li
                  className={styles.gridItem}
                  data-format={image.format}
                  data-position={imageIndex === 0 ? "lead" : undefined}
                  key={image.sourceAssetId}
                >
                  <figure className={styles.figure}>
                    <button
                      aria-label={`Padidinti vaizdą: ${image.caption}`}
                      className={styles.imageButton}
                      onClick={(event) => openImage(image, event.currentTarget)}
                      type="button"
                    >
                      <span className={styles.imageFrame}>
                        <Image
                          alt={image.alt}
                          className={styles.image}
                          fill
                          sizes="(min-width: 80rem) 52vw, (min-width: 48rem) 66vw, 82vw"
                          src={image.localPath}
                        />
                      </span>
                      <span aria-hidden="true" className={styles.expandIcon}>
                        <Maximize2 size={19} strokeWidth={1.5} />
                      </span>
                    </button>
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <dialog
        aria-label={activeImage ? `Padidintas vaizdas: ${activeImage.caption}` : "Padidintas darbų vaizdas"}
        className={styles.dialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onClose={handleDialogClose}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            showAdjacentImage(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            showAdjacentImage(1);
          }
        }}
        ref={dialogRef}
      >
        {activeImage ? (
          <div className={styles.dialogPanel}>
            <div className={styles.dialogMedia}>
              <Image
                alt={activeImage.alt}
                className={styles.dialogImage}
                fill
                priority
                sizes="96vw"
                src={activeImage.localPath}
              />
            </div>
            <div className={styles.dialogCaption}>
              <strong>{activeImage.chapterTitle}</strong>
              <p>{activeImage.caption}</p>
            </div>
            <button aria-label="Uždaryti vaizdą" className={styles.dialogClose} onClick={closeDialog} type="button">
              <X size={24} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Ankstesnis vaizdas"
              className={`${styles.dialogNavigation} ${styles.dialogPrevious}`}
              onClick={() => showAdjacentImage(-1)}
              type="button"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Kitas vaizdas"
              className={`${styles.dialogNavigation} ${styles.dialogNext}`}
              onClick={() => showAdjacentImage(1)}
              type="button"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
