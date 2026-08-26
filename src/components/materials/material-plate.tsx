"use client";

import Image from "next/image";
import Link from "next/link";
import { Columns3, Expand, Heart } from "lucide-react";
import type { Material } from "@/data/materials";

type MaterialPlateProps = {
  material: Material;
  saved: boolean;
  compared: boolean;
  compareLimitReached: boolean;
  position: number;
  onQuickView: (slug: string, trigger: HTMLButtonElement) => void;
  onToggleSaved: (slug: string) => void;
  onToggleCompare: (slug: string) => void;
};

export function MaterialPlate({
  material,
  saved,
  compared,
  compareLimitReached,
  position,
  onQuickView,
  onToggleSaved,
  onToggleCompare,
}: MaterialPlateProps) {
  const compareDisabled = compareLimitReached && !compared;

  return (
    <article className="material-plate">
      <button
        className="material-plate__image-button"
        type="button"
        onClick={(event) => onQuickView(material.slug, event.currentTarget)}
        aria-label={`Greitai peržiūrėti „${material.name}“`}
      >
        <span className="material-plate__image">
          <Image
            alt={`${material.name} akmens katalogo vaizdas`}
            fill
            loading={position < 4 ? "eager" : "lazy"}
            sizes="(min-width: 80rem) 20vw, (min-width: 64rem) 33vw, (min-width: 44rem) 50vw, (min-width: 22rem) 46vw, 100vw"
            src={material.localPath}
          />
        </span>
        <span className="material-plate__quick-view" aria-hidden="true">
          <Expand size={16} strokeWidth={1.5} />
          Greita peržiūra
        </span>
      </button>

      <div className="material-plate__caption">
        <div className="material-plate__identity">
          <h2>
            <Link href={`/akmuo/${material.slug}`}>{material.name}</Link>
          </h2>
        </div>

        <div className="material-plate__actions" aria-label={`${material.name} veiksmai`}>
          <button
            className="material-icon-button"
            type="button"
            data-active={saved || undefined}
            onClick={() => onToggleSaved(material.slug)}
            aria-label={saved ? `Pašalinti „${material.name}“ iš išsaugotų` : `Išsaugoti „${material.name}“`}
            aria-pressed={saved}
          >
            <Heart aria-hidden="true" fill={saved ? "currentColor" : "none"} size={18} strokeWidth={1.5} />
          </button>
          <button
            className="material-icon-button"
            type="button"
            data-active={compared || undefined}
            disabled={compareDisabled}
            onClick={() => onToggleCompare(material.slug)}
            aria-label={compared ? `Pašalinti „${material.name}“ iš palyginimo` : `Pridėti „${material.name}“ į palyginimą`}
            aria-pressed={compared}
            title={compareDisabled ? "Vienu metu galima palyginti iki 3 akmenų" : undefined}
          >
            <Columns3 aria-hidden="true" size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
