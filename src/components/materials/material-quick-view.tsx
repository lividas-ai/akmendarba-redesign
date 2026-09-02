"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Columns3, Heart, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Material } from "@/client/materials";

type MaterialQuickViewProps = {
  material: Material | null;
  categoryName: string;
  saved: boolean;
  compared: boolean;
  compareLimitReached: boolean;
  onDismiss: () => void;
  onToggleSaved: (slug: string) => void;
  onToggleCompare: (slug: string) => void;
};

export function MaterialQuickView({
  material,
  categoryName,
  saved,
  compared,
  compareLimitReached,
  onDismiss,
  onToggleSaved,
  onToggleCompare,
}: MaterialQuickViewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (material && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    }

    if (!material && dialog.open) dialog.close();
  }, [material]);

  const compareDisabled = Boolean(material && compareLimitReached && !compared);

  return (
    <dialog
      className="material-dialog material-quick-view"
      ref={dialogRef}
      aria-labelledby="quick-view-title"
      aria-describedby="quick-view-description"
      onClose={onDismiss}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      {material ? (
        <div className="material-quick-view__panel">
          <button
            className="material-dialog__close"
            ref={closeButtonRef}
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Uždaryti greitą peržiūrą"
          >
            <X aria-hidden="true" size={22} strokeWidth={1.5} />
          </button>

          <figure className="material-quick-view__visual">
            <Image
              alt={`Akmendarba pristatomo akmens vaizdas: ${material.name}`}
              fill
              sizes="(min-width: 64rem) 62vw, 100vw"
              src={material.localPath}
            />
          </figure>

          <div className="material-quick-view__content">
            <span className="eyebrow">{categoryName}</span>
            <h2 id="quick-view-title">{material.name}</h2>
            <p id="quick-view-description">{material.sourceContext}</p>

            <div className="material-quick-view__actions">
              <button
                className="button button--secondary"
                type="button"
                data-active={saved || undefined}
                onClick={() => onToggleSaved(material.slug)}
                aria-pressed={saved}
              >
                <Heart aria-hidden="true" fill={saved ? "currentColor" : "none"} size={17} strokeWidth={1.6} />
                {saved ? "Išsaugota" : "Išsaugoti"}
              </button>
              <button
                className="button button--ghost"
                type="button"
                data-active={compared || undefined}
                disabled={compareDisabled}
                onClick={() => onToggleCompare(material.slug)}
                aria-pressed={compared}
              >
                <Columns3 aria-hidden="true" size={17} strokeWidth={1.6} />
                {compared ? "Palyginime" : "Palyginti"}
              </button>
            </div>

            <div className="material-quick-view__links">
              <Link href={`/kontaktai?akmenys=${material.slug}`}>
                Klausti apie šią medžiagos kryptį <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>

            <aside className="material-variation-note">
              <strong>Pasirinkimą reikia patvirtinti.</strong>
              <span>{material.notes}</span>
            </aside>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
