"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  MATERIAL_SAVED_EVENT,
  readSavedMaterials,
  toggleSavedMaterial,
} from "@/lib/material-storage";

type MaterialDetailActionsProps = {
  slug: string;
  name: string;
};

export function MaterialDetailActions({ slug, name }: MaterialDetailActionsProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const updateSavedState = () => setSaved(readSavedMaterials().includes(slug));
    updateSavedState();
    window.addEventListener("storage", updateSavedState);
    window.addEventListener(MATERIAL_SAVED_EVENT, updateSavedState);

    return () => {
      window.removeEventListener("storage", updateSavedState);
      window.removeEventListener(MATERIAL_SAVED_EVENT, updateSavedState);
    };
  }, [slug]);

  function toggleSaved() {
    const result = toggleSavedMaterial(slug);
    setSaved(result.saved);
  }

  return (
    <div className="material-detail-actions">
      <Link className="button button--primary" href={`/projektas?akmuo=${encodeURIComponent(slug)}`}>
        Pridėti prie projekto
        <ArrowRight aria-hidden="true" size={17} />
      </Link>
      <button
        className="button button--secondary"
        type="button"
        onClick={toggleSaved}
        aria-label={saved ? `Pašalinti „${name}“ iš išsaugotų` : `Išsaugoti „${name}“`}
        aria-pressed={saved}
      >
        <Heart aria-hidden="true" fill={saved ? "currentColor" : "none"} size={17} strokeWidth={1.6} />
        {saved ? "Išsaugota" : "Išsaugoti akmenį"}
      </button>
    </div>
  );
}
