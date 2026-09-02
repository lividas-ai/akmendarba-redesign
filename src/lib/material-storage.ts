import { activeBrandConfig } from "@/client/brand";

export const MATERIAL_SAVED_KEY = `${activeBrandConfig.siteId}-saved-v1`;
export const MATERIAL_SAVED_EVENT = `${activeBrandConfig.siteId}:saved-change`;
export const MATERIAL_COMPARE_KEY = `${activeBrandConfig.siteId}-compare-v1`;
export const MATERIAL_COMPARE_EVENT = `${activeBrandConfig.siteId}:compare-change`;

export const MAXIMUM_COMPARED_MATERIALS = 3;

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

function readMaterialCollection(key: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? normalizeSavedValue(JSON.parse(storedValue)) : [];
  } catch {
    return [];
  }
}

function writeMaterialCollection(
  key: string,
  eventName: string,
  slugs: readonly string[],
  limit?: number,
): string[] {
  const normalized = normalizeSavedValue(slugs);
  const limited = typeof limit === "number" ? normalized.slice(0, limit) : normalized;
  if (typeof window === "undefined") return limited;

  try {
    window.localStorage.setItem(key, JSON.stringify(limited));
    window.dispatchEvent(new CustomEvent(eventName, { detail: limited }));
  } catch {
    // The catalogue remains usable when storage is unavailable or full.
  }

  return limited;
}

export function readSavedMaterials(): string[] {
  return readMaterialCollection(MATERIAL_SAVED_KEY);
}

export function writeSavedMaterials(slugs: readonly string[]): string[] {
  return writeMaterialCollection(MATERIAL_SAVED_KEY, MATERIAL_SAVED_EVENT, slugs);
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

export function readComparedMaterials(): string[] {
  return readMaterialCollection(MATERIAL_COMPARE_KEY).slice(0, MAXIMUM_COMPARED_MATERIALS);
}

export function writeComparedMaterials(slugs: readonly string[]): string[] {
  return writeMaterialCollection(
    MATERIAL_COMPARE_KEY,
    MATERIAL_COMPARE_EVENT,
    slugs,
    MAXIMUM_COMPARED_MATERIALS,
  );
}

export function toggleComparedMaterial(slug: string): {
  compared: boolean;
  limitReached: boolean;
  slugs: string[];
} {
  const current = readComparedMaterials();

  if (current.includes(slug)) {
    return {
      compared: false,
      limitReached: false,
      slugs: writeComparedMaterials(current.filter((item) => item !== slug)),
    };
  }

  if (current.length >= MAXIMUM_COMPARED_MATERIALS) {
    return { compared: false, limitReached: true, slugs: current };
  }

  return {
    compared: true,
    limitReached: false,
    slugs: writeComparedMaterials([...current, slug]),
  };
}
