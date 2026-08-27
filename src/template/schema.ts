export type Id = string;

export type NonEmpty<T> = readonly [T, ...T[]];

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

export type Publication = "draft" | "ready" | "published" | "withheld";
export type Device = "desktop" | "tablet" | "mobile";
export type ParityState =
  | "pending"
  | "equivalent"
  | "adapted"
  | "intentional-omit"
  | "failed"
  | "blocked";

export type EvidenceRef = {
  sourceId: Id;
  /** URL fragment, selector, file page, media timestamp, or interview section. */
  locator?: string;
  note?: string;
};

export type TextValue =
  | {
      value: string;
      origin: "source" | "client";
      evidence: NonEmpty<EvidenceRef>;
    }
  | {
      value: string;
      origin: "derived";
      evidence: NonEmpty<EvidenceRef>;
      /** Explain the rewrite. It may not introduce a new factual meaning. */
      derivation: string;
    }
  | {
      /** Reserved for non-factual interface labels such as Menu, Back, or Search. */
      value: string;
      origin: "ui";
    };

export type SourceRecord =
  | {
      id: Id;
      kind: "url";
      url: string;
      canonicalUrl?: string;
      title?: string;
      retrievedAt: string;
      status: "captured" | "partial" | "unavailable";
      checksum?: string;
    }
  | {
      id: Id;
      kind: "file" | "client-input" | "interview" | "dataset";
      artifactId: string;
      title: string;
      receivedAt: string;
      checksum?: string;
    };

export type CoverageDestination = {
  kind: "page" | "media" | "function";
  id: Id;
};

export type SourceCoverageRecord =
  | {
      sourceId: Id;
      status: "migrated" | "adapted";
      destinations: NonEmpty<CoverageDestination>;
      reviewedAt: string;
      note?: string;
    }
  | {
      sourceId: Id;
      status: "intentional-omit";
      destinations?: readonly CoverageDestination[];
      reviewedAt: string;
      rationale: string;
      approval: { by: string; at: string };
    }
  | {
      sourceId: Id;
      status: "blocked";
      destinations?: readonly CoverageDestination[];
      reviewedAt: string;
      rationale: string;
    };

export type ParityCheck = {
  status: ParityState;
  checkedAt?: string;
  artifactIds?: readonly Id[];
  rationale?: string;
};

export type ParityMatrix = Record<Device, ParityCheck>;

export type MediaVariant = {
  src: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  mimeType: string;
  checksum?: string;
};

export type MediaAsset = {
  id: Id;
  kind: "logo" | "image" | "video" | "audio" | "document";
  decorative?: boolean;
  alt?: TextValue;
  variants: NonEmpty<MediaVariant>;
  provenance: {
    evidence: NonEmpty<EvidenceRef>;
    originalUri?: string;
    creator?: string;
    rights: "confirmed" | "client-owned" | "licensed" | "unknown";
    consent?: string;
    transformations?: readonly string[];
  };
  parity: ParityMatrix;
};

export type ActionTarget =
  | { kind: "page"; pageId: Id }
  | { kind: "function"; functionId: Id }
  | { kind: "external"; url: string; evidence: NonEmpty<EvidenceRef> };

export type Action = {
  id: Id;
  label: TextValue;
  target: ActionTarget;
};

export interface CoreBlockRegistry {
  hero: {
    eyebrow?: TextValue;
    heading: TextValue;
    body?: TextValue;
    mediaId?: Id;
    actions?: NonEmpty<Action>;
  };
  richText: {
    heading?: TextValue;
    paragraphs: NonEmpty<TextValue>;
  };
  media: {
    mediaIds: NonEmpty<Id>;
    caption?: TextValue;
  };
  collection: {
    heading?: TextValue;
    itemPageIds: NonEmpty<Id>;
    presentation: "grid" | "rail" | "list";
  };
  facts: {
    heading?: TextValue;
    items: NonEmpty<{ label: TextValue; value: TextValue }>;
  };
  process: {
    heading?: TextValue;
    steps: NonEmpty<{ id: Id; title: TextValue; body?: TextValue }>;
  };
  gallery: {
    heading?: TextValue;
    mediaIds: NonEmpty<Id>;
  };
  callToAction: {
    heading?: TextValue;
    body?: TextValue;
    actions: NonEmpty<Action>;
  };
  function: {
    functionId: Id;
  };
}

/** Client packages can augment this interface through declaration merging. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Intentional declaration-merging extension point.
export interface ClientBlockRegistry extends Record<never, never> {}

export type BlockRegistry = CoreBlockRegistry & ClientBlockRegistry;

export type Block = {
  [K in keyof BlockRegistry]: {
    id: Id;
    type: K;
    publication: Publication;
    data: BlockRegistry[K];
    parity: ParityMatrix;
  };
}[keyof BlockRegistry];

export type PageRecord = {
  id: Id;
  path: `/${string}`;
  kind: "home" | "index" | "detail" | "contact" | "legal" | "utility" | "custom";
  parentPageId?: Id;
  title: TextValue;
  navigationTitle?: TextValue;
  publication: Publication;
  blocks: readonly Block[];
  seo?: {
    title: TextValue;
    description?: TextValue;
    imageMediaId?: Id;
    noIndex?: boolean;
  };
  parity: ParityMatrix;
};

export interface CoreFunctionRegistry {
  calculator: JsonValue;
  selector: JsonValue;
  configurator: JsonValue;
  form: JsonValue;
  custom: JsonValue;
}

/** Client packages can augment this interface through declaration merging. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Intentional declaration-merging extension point.
export interface ClientFunctionRegistry extends Record<never, never> {}

export type FunctionRegistry = CoreFunctionRegistry & ClientFunctionRegistry;

/**
 * A visible tool can be composed from multiple independently releasable function
 * rows. For example, quote calculation can run locally while CRM delivery remains
 * withheld. `experienceId` groups those rows without merging their release state.
 */
export type FunctionCapability = {
  experienceId: Id;
  capabilityId: Id;
  kind:
    | "input"
    | "calculation"
    | "selection"
    | "configuration"
    | "persistence"
    | "delivery"
    | "integration"
    | "custom";
  execution: "local" | "remote";
  label: TextValue;
  evidence: NonEmpty<EvidenceRef>;
};

export type IntegrationApproval = {
  /** Evidence source containing the client's decision. */
  sourceId: Id;
  by: string;
  at: string;
  decision: "defer" | "withhold" | "proceed-frontend-only";
};

/**
 * Machine-checkable trace for a function that cannot be fully integrated.
 * The duplicated function/publication values are deliberate: validation catches
 * stale ledgers after a function is renamed or its release state changes.
 */
export type FunctionIntegrationBlocker = {
  sourceId: Id;
  functionId: Id;
  publication: Publication;
  rationale: string;
  approval?: IntegrationApproval;
};

export type FunctionRecord = {
  [K in keyof FunctionRegistry]: {
    id: Id;
    type: K;
    implementationKey: string;
    config: FunctionRegistry[K];
    evidence: NonEmpty<EvidenceRef>;
    publication: Publication;
    testFixtureIds: NonEmpty<Id>;
    parity: ParityMatrix;
    integrationStatus: "complete" | "frontend-only" | "blocked";
    capability?: FunctionCapability;
    integrationBlocker?: FunctionIntegrationBlocker;
    /** @deprecated Prefer integrationBlocker.rationale for traceable blockers. */
    blockedReason?: string;
  };
}[keyof FunctionRegistry];

export type NavigationItem = {
  id: Id;
  label: TextValue;
  target: ActionTarget;
  mediaId?: Id;
  children?: readonly NavigationItem[];
};

export type SiteManifest = {
  schemaVersion: string;
  siteId: Id;
  defaultLocale: string;
  brand: {
    name: TextValue;
    legalName?: TextValue;
    logoMediaId?: Id;
    accent: string;
  };
  homePageId: Id;
  primaryPageId: Id;
  sources: readonly SourceRecord[];
  sourceCoverage: readonly SourceCoverageRecord[];
  media: readonly MediaAsset[];
  functions: readonly FunctionRecord[];
  pages: readonly PageRecord[];
  navigation: {
    primary: readonly NavigationItem[];
    utility: readonly NavigationItem[];
    footer: readonly NavigationItem[];
  };
};

export const sourceText = (value: string, evidence: NonEmpty<EvidenceRef>): TextValue => ({
  value,
  origin: "source",
  evidence,
});

export const clientText = (value: string, evidence: NonEmpty<EvidenceRef>): TextValue => ({
  value,
  origin: "client",
  evidence,
});

export const derivedText = (
  value: string,
  evidence: NonEmpty<EvidenceRef>,
  derivation: string,
): TextValue => ({ value, origin: "derived", evidence, derivation });

export const uiText = (value: string): TextValue => ({ value, origin: "ui" });

export const pendingParity = (): ParityMatrix => ({
  desktop: { status: "pending" },
  tablet: { status: "pending" },
  mobile: { status: "pending" },
});

export const approvedParity = (checkedAt: string, artifactIds: readonly Id[] = []): ParityMatrix => ({
  desktop: { status: "equivalent", checkedAt, artifactIds },
  tablet: { status: "adapted", checkedAt, artifactIds },
  mobile: { status: "adapted", checkedAt, artifactIds },
});
