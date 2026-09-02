"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Heart, X } from "lucide-react";
import { materials } from "@/client/materials";
import { activeContactConfig } from "@/client/contact";
import {
  MATERIAL_SAVED_EVENT,
  readSavedMaterials,
  writeSavedMaterials,
} from "@/lib/material-storage";

type SavedStonesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SavedStonesDialog({ open, onOpenChange }: SavedStonesDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const emptyActionRef = useRef<HTMLAnchorElement>(null);
  const removeButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [focusAfterRemoval, setFocusAfterRemoval] = useState<string | "empty" | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const refresh = () => setSavedSlugs(readSavedMaterials());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(MATERIAL_SAVED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(MATERIAL_SAVED_EVENT, refresh);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    }
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const savedMaterials = useMemo(
    () => savedSlugs.map((slug) => materials.find((material) => material.slug === slug)).filter((material) => material !== undefined),
    [savedSlugs],
  );
  const contactHref = `/kontaktai?akmenys=${savedMaterials.map((material) => material.slug).join(",")}`;

  useEffect(() => {
    if (!focusAfterRemoval) return;

    const frameId = window.requestAnimationFrame(() => {
      if (focusAfterRemoval === "empty") emptyActionRef.current?.focus();
      else removeButtonRefs.current[focusAfterRemoval]?.focus();
      setFocusAfterRemoval(null);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [focusAfterRemoval, savedSlugs]);

  function removeMaterial(slug: string) {
    const currentIndex = savedSlugs.indexOf(slug);
    const nextSavedSlugs = writeSavedMaterials(savedSlugs.filter((savedSlug) => savedSlug !== slug));
    const nextFocusSlug = nextSavedSlugs[Math.min(currentIndex, nextSavedSlugs.length - 1)];
    const removedMaterial = materials.find((material) => material.slug === slug);

    setSavedSlugs(nextSavedSlugs);
    setStatusMessage(`${removedMaterial?.name ?? "Akmuo"} pašalintas iš išsaugotų.`);
    setFocusAfterRemoval(nextFocusSlug ?? "empty");
  }

  return (
    <dialog
      aria-label="Išsaugotos medžiagų kryptys"
      className="saved-stones"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => {
        onOpenChange(false);
        window.requestAnimationFrame(() => returnFocusRef.current?.focus());
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onOpenChange(false);
      }}
    >
      <div className="saved-stones__panel">
        <div className="saved-stones__top">
          <div>
            <Heart aria-hidden="true" size={20} strokeWidth={1.4} />
            <p>Išsaugotos kryptys</p>
            <span>{savedMaterials.length}</span>
          </div>
          <button aria-label="Uždaryti išsaugotus akmenis" type="button" onClick={() => onOpenChange(false)}>
            <X aria-hidden="true" size={22} strokeWidth={1.4} />
          </button>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </p>

        {savedMaterials.length ? (
          <>
            <div className="saved-stones__list">
              {savedMaterials.map((material) => (
                <article key={material.slug}>
                  <Link href={`/akmuo#medziaga-${material.slug}`} onClick={() => onOpenChange(false)}>
                    <span className="saved-stones__image">
                      <Image alt="" fill sizes="88px" src={material.localPath} />
                    </span>
                    <span>
                      <strong>{material.name}</strong>
                      <small>Medžiagos kryptis</small>
                    </span>
                  </Link>
                  <button
                    aria-label={`Pašalinti ${material.name} iš išsaugotų`}
                    ref={(node) => {
                      removeButtonRefs.current[material.slug] = node;
                    }}
                    type="button"
                    onClick={() => removeMaterial(material.slug)}
                  >
                    <X aria-hidden="true" size={17} strokeWidth={1.4} />
                  </button>
                </article>
              ))}
            </div>

            <div className="saved-stones__actions">
              <Link className="button button--primary" href={contactHref} onClick={() => onOpenChange(false)}>
                Aptarti pasirinkimą <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link className="button button--secondary" href="/akmuo#pasirinkimas" onClick={() => onOpenChange(false)}>
                Peržiūrėti pasirinkime
              </Link>
            </div>
          </>
        ) : (
          <div className="saved-stones__empty">
            <h2>Jūsų atranka tuščia.</h2>
            <p>Išsaugokite granitą arba marmurą, kad pasirinkimą rastumėte vienoje vietoje.</p>
            <Link ref={emptyActionRef} className="button button--primary" href="/akmuo#pasirinkimas" onClick={() => onOpenChange(false)}>
              Rinktis medžiagą <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <button type="button" onClick={() => onOpenChange(false)}>
              Tęsti naršymą
            </button>
          </div>
        )}

        {activeContactConfig.phone || activeContactConfig.email ? (
          <div className="saved-stones__help">
            <p>Reikia pagalbos renkantis?</p>
            {activeContactConfig.phone ? <a href={activeContactConfig.phone.href}>{activeContactConfig.phone.display}</a> : null}
            {activeContactConfig.email ? <a href={activeContactConfig.email.href}>{activeContactConfig.email.display}</a> : null}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
