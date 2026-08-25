export const MATERIAL_SAVED_KEY = "granit-decor-saved-v1";
export const MATERIAL_SAVED_EVENT = "granit:saved-change";

function normalizeSavedValue(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value.filter(
        (item): item is string =>
          typeof item === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item),
      ),
    ),
  );
}

export function readSavedMaterials(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(MATERIAL_SAVED_KEY);
    return storedValue ? normalizeSavedValue(JSON.parse(storedValue)) : [];
  } catch {
    return [];
  }
}

export function writeSavedMaterials(slugs: readonly string[]): string[] {
  const normalized = normalizeSavedValue(slugs);
  if (typeof window === "undefined") return normalized;

  try {
    window.localStorage.setItem(MATERIAL_SAVED_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent(MATERIAL_SAVED_EVENT, { detail: normalized }));
  } catch {
    // The catalogue remains usable when storage is unavailable or full.
  }

  return normalized;
}

export function toggleSavedMaterial(slug: string): {
  saved: boolean;
  slugs: string[];
} {
  const current = readSavedMaterials();
  const exists = current.includes(slug);
  const next = exists ? current.filter((item) => item !== slug) : [...current, slug];

  return {
    saved: !exists,
    slugs: writeSavedMaterials(next),
  };
}
