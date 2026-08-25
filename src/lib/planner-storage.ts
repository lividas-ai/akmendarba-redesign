export const PLANNER_STORAGE_KEY = "granit-decor-project-plan-v1";
export const SAVED_MATERIALS_STORAGE_KEY = "granit-decor-saved-v1";
export const PLANNER_STORAGE_VERSION = 1 as const;

export type PlannerMode = "editing" | "review";

export type PlannerData = {
  projectType: string;
  projectDescription: string;
  dimensionsStatus: string;
  dimensions: string;
  detailFlags: string[];
  stoneDecision: string;
  stoneCategories: string[];
  selectedMaterialSlugs: string[];
  stoneNotes: string;
  location: string;
  projectStage: string;
  timing: string;
  siteNotes: string;
  contactName: string;
  company: string;
  email: string;
  phone: string;
  contactPreference: string;
  consent: boolean;
};

export type PlannerDraft = {
  version: typeof PLANNER_STORAGE_VERSION;
  savedAt: string;
  step: number;
  mode: PlannerMode;
  data: PlannerData;
};

type PlannerDraftInput = Pick<PlannerDraft, "step" | "mode" | "data">;

const DATA_KEYS: readonly (keyof PlannerData)[] = [
  "projectType",
  "projectDescription",
  "dimensionsStatus",
  "dimensions",
  "detailFlags",
  "stoneDecision",
  "stoneCategories",
  "selectedMaterialSlugs",
  "stoneNotes",
  "location",
  "projectStage",
  "timing",
  "siteNotes",
  "contactName",
  "company",
  "email",
  "phone",
  "contactPreference",
  "consent",
] as const;

export function createEmptyPlannerData(): PlannerData {
  return {
    projectType: "",
    projectDescription: "",
    dimensionsStatus: "",
    dimensions: "",
    detailFlags: [],
    stoneDecision: "",
    stoneCategories: [],
    selectedMaterialSlugs: [],
    stoneNotes: "",
    location: "",
    projectStage: "",
    timing: "",
    siteNotes: "",
    contactName: "",
    company: "",
    email: "",
    phone: "",
    contactPreference: "",
    consent: false,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.slice(0, 4000) : "";
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 150),
    ),
  );
}

function readPlannerData(value: unknown): PlannerData | null {
  if (!isRecord(value)) return null;

  const empty = createEmptyPlannerData();
  const parsed = { ...empty } as PlannerData;

  for (const key of DATA_KEYS) {
    if (key === "detailFlags" || key === "stoneCategories" || key === "selectedMaterialSlugs") {
      parsed[key] = readStringArray(value[key]);
    } else if (key === "consent") {
      parsed[key] = value[key] === true;
    } else {
      parsed[key] = readString(value[key]);
    }
  }

  return parsed;
}

export function loadPlannerDraft(): PlannerDraft | null {
  try {
    const raw = window.localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== PLANNER_STORAGE_VERSION) return null;

    const data = readPlannerData(parsed.data);
    if (!data) return null;

    const rawStep = typeof parsed.step === "number" ? parsed.step : 0;
    const step = Math.min(4, Math.max(0, Math.trunc(rawStep)));
    const mode: PlannerMode = parsed.mode === "review" ? "review" : "editing";

    return {
      version: PLANNER_STORAGE_VERSION,
      savedAt: readString(parsed.savedAt),
      step,
      mode,
      data,
    };
  } catch {
    return null;
  }
}

export function savePlannerDraft(input: PlannerDraftInput): PlannerDraft | null {
  try {
    const draft: PlannerDraft = {
      version: PLANNER_STORAGE_VERSION,
      savedAt: new Date().toISOString(),
      step: Math.min(4, Math.max(0, Math.trunc(input.step))),
      mode: input.mode,
      data: input.data,
    };

    window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(draft));
    return draft;
  } catch {
    return null;
  }
}

export function clearPlannerDraft(): void {
  try {
    window.localStorage.removeItem(PLANNER_STORAGE_KEY);
  } catch {
    // Storage can be unavailable in private browsing or locked-down environments.
  }
}

function extractSlugs(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string") return [item];
      if (!isRecord(item)) return [];
      if (typeof item.slug === "string") return [item.slug];
      if (typeof item.id === "string") return [item.id];
      return [];
    });
  }

  if (!isRecord(value)) return [];

  for (const key of ["slugs", "saved", "items", "materials"] as const) {
    if (key in value) {
      const slugs = extractSlugs(value[key]);
      if (slugs.length > 0) return slugs;
    }
  }

  return Object.entries(value).flatMap(([key, selected]) =>
    selected === true ? [key] : [],
  );
}

export function readSavedMaterialSlugs(): string[] {
  try {
    const raw = window.localStorage.getItem(SAVED_MATERIALS_STORAGE_KEY);
    if (!raw) return [];

    return Array.from(
      new Set(
        extractSlugs(JSON.parse(raw))
          .map((slug) => slug.trim())
          .filter(Boolean),
      ),
    );
  } catch {
    return [];
  }
}
