import {
  approvedParity,
  type CoverageDestination,
  derivedText,
  sourceText,
  uiText,
  type Block,
  type EvidenceRef,
  type FunctionRecord,
  type MediaAsset,
  type NonEmpty,
  type PageRecord,
  type SiteManifest,
  type SourceRecord,
  type SourceCoverageRecord,
} from "@/template/schema";
import { assertValidSiteManifest } from "@/template/validate-manifest";
import {
  applications,
  primaryNavigation,
  projects,
  utilityNavigation,
} from "@/client/granit-decor/data/content";
import { materials } from "@/client/granit-decor/data/materials";
import { portfolioItems } from "@/client/granit-decor/data/portfolio-gallery";
import { granitDecorSiteConfig } from "@/client/granit-decor/site-config";

const capturedAt = "2026-08-25T12:00:00+03:00";
const reviewedAt = "2026-08-26";
const parity = approvedParity(reviewedAt, ["DESIGN_REVIEW.md"]);

const evidence = (sourceId: string, locator?: string): NonEmpty<EvidenceRef> => [
  { sourceId, ...(locator ? { locator } : {}) },
];

const fixedSources: readonly SourceRecord[] = [
  {
    id: "source-home",
    kind: "url",
    url: "https://www.granitdecor.lt/",
    canonicalUrl: "https://www.granitdecor.lt/",
    title: "Granit Decor",
    retrievedAt: capturedAt,
    status: "captured",
  },
  {
    id: "source-products",
    kind: "url",
    url: "https://www.granitdecor.lt/naturalaus-akmens-gaminiai",
    title: "Natūralaus akmens gaminiai",
    retrievedAt: capturedAt,
    status: "captured",
  },
  {
    id: "source-materials-index",
    kind: "url",
    url: "https://www.granitdecor.lt/naturalus-akmuo",
    title: "Natūralus akmuo",
    retrievedAt: capturedAt,
    status: "captured",
  },
  {
    id: "source-projects",
    kind: "url",
    url: "https://www.granitdecor.lt/akmens-gaminiai",
    title: "Viešas darbų archyvas",
    retrievedAt: capturedAt,
    status: "captured",
  },
  {
    id: "source-logo",
    kind: "url",
    url: "https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/Granit-Decor-Logotipas-02.png",
    title: "Granit Decor logotipas",
    retrievedAt: capturedAt,
    status: "captured",
  },
  {
    id: "source-hero-film",
    kind: "client-input",
    artifactId: "higgsfield-minimax-h3-6ef23a61-b063-4be7-9ed2-8727d99ba31e",
    title: "Approved 360-degree kitchen orbit",
    receivedAt: "2026-08-25",
  },
  ...granitDecorSiteConfig.sitemap.map((route) => ({
    id: `source-route-${route.path === "" ? "home" : route.path.slice(1).replaceAll("/", "-")}`,
    kind: "url" as const,
    url: `${granitDecorSiteConfig.seo.canonicalUrl}${route.path || "/"}`,
    retrievedAt: capturedAt,
    status: "partial" as const,
  })),
  ...materials.map((material) => ({
    id: `source-material-${material.slug}`,
    kind: "url" as const,
    url: material.sourceUrl,
    title: material.name,
    retrievedAt: capturedAt,
    status: "captured" as const,
  })),
  ...portfolioItems.map((item) => ({
    id: `source-portfolio-${item.slug}`,
    kind: "url" as const,
    url: item.sourceUrl,
    title: item.categoryLabel,
    retrievedAt: capturedAt,
    status: "captured" as const,
  })),
];

const sources = fixedSources.filter(
  (source, index, all) => all.findIndex((candidate) => candidate.id === source.id) === index,
);

const templateMedia: readonly MediaAsset[] = [
  {
    id: "media-logo",
    kind: "logo",
    decorative: true,
    variants: [
      {
        src: "/assets/brand/granit-decor-logo.png",
        width: 300,
        height: 326,
        mimeType: "image/png",
      },
    ],
    provenance: {
      evidence: evidence("source-logo"),
      originalUri: "https://irp.cdn-website.com/b8e91eb1/dms3rep/multi/Granit-Decor-Logotipas-02.png",
      rights: "unknown",
      transformations: ["Self-hosted without visual alteration"],
    },
    parity,
  },
  {
    id: "media-hero-film",
    kind: "video",
    decorative: true,
    variants: [
      {
        src: "/assets/video/granit-decor-kitchen-orbit-v2-desktop-2560.mp4",
        width: 2560,
        height: 1440,
        durationSeconds: 15.08,
        mimeType: "video/mp4",
      },
      {
        src: "/assets/video/granit-decor-kitchen-orbit-v3-mobile-parity-810x1440.mp4",
        width: 810,
        height: 1440,
        durationSeconds: 15.08,
        mimeType: "video/mp4",
      },
    ],
    provenance: {
      evidence: evidence("source-hero-film"),
      rights: "unknown",
      transformations: ["AI-assisted generation", "Portrait version is a deterministic crop of the desktop timeline"],
    },
    parity,
  },
];

const materialMedia: readonly MediaAsset[] = materials.map((material) => ({
  id: `media-material-${material.slug}`,
  kind: "image",
  alt: derivedText(
    `${material.name} akmens paviršius`,
    evidence(`source-material-${material.slug}`),
    "The material name is source data; the phrase identifies the pictured swatch without adding a suitability or origin claim.",
  ),
  variants: [{ src: material.localPath, mimeType: "image/webp" }],
  provenance: {
    evidence: evidence(`source-material-${material.slug}`),
    originalUri: material.sourceUrl,
    rights: "unknown",
    transformations: ["Converted to self-hosted WebP"],
  },
  parity,
}));

const portfolioMedia: readonly MediaAsset[] = portfolioItems.map((item) => ({
  id: `media-portfolio-${item.slug}`,
  kind: "image",
  alt: sourceText(item.alt, evidence(`source-portfolio-${item.slug}`)),
  variants: [{ src: item.localPath, mimeType: "image/webp" }],
  provenance: {
    evidence: evidence(`source-portfolio-${item.slug}`),
    originalUri: item.sourceUrl,
    rights: "unknown",
    transformations: ["Converted to self-hosted WebP"],
  },
  parity,
}));

const staticPageDefinitions = [
  { id: "page-home", path: "/", title: "Granit Decor", sourceId: "source-home", kind: "home" },
  { id: "page-products", path: "/gaminiai", title: "Gaminiai", sourceId: "source-products", kind: "index" },
  { id: "page-materials", path: "/akmuo", title: "Akmuo", sourceId: "source-materials-index", kind: "index", functionId: "function-material-selector" },
  { id: "page-projects", path: "/projektai", title: "Projektai", sourceId: "source-projects", kind: "index" },
  { id: "page-process", path: "/kaip-dirbame", title: "Kaip dirbame", sourceId: "source-route-kaip-dirbame", kind: "custom" },
  { id: "page-professionals", path: "/profesionalams", title: "Profesionalams", sourceId: "source-route-profesionalams", kind: "custom" },
  { id: "page-about", path: "/apie-mus", title: "Apie mus", sourceId: "source-route-apie-mus", kind: "custom" },
  { id: "page-planner", path: "/projektas", title: "Projekto planas", sourceId: "source-route-projektas", kind: "utility", functionId: "function-project-planner" },
  { id: "page-contact", path: "/kontaktai", title: "Kontaktai", sourceId: "source-route-kontaktai", kind: "contact" },
  { id: "page-memorials", path: "/memorialai", title: "Memorialai", sourceId: "source-route-memorialai", kind: "custom" },
  { id: "page-journal", path: "/zurnalas", title: "Žurnalas", sourceId: "source-route-zurnalas", kind: "index" },
  { id: "page-article-countertop", path: "/zurnalas/kaip-rinktis-virtuves-stalvirsi", title: "Kaip rinktis virtuvės stalviršį", sourceId: "source-route-zurnalas-kaip-rinktis-virtuves-stalvirsi", kind: "detail", parentPageId: "page-journal" },
  { id: "page-article-care", path: "/zurnalas/naturalaus-akmens-prieziura", title: "Natūralaus akmens priežiūra", sourceId: "source-route-zurnalas-naturalaus-akmens-prieziura", kind: "detail", parentPageId: "page-journal" },
  { id: "page-privacy", path: "/privatumas", title: "Privatumas", sourceId: "source-route-privatumas", kind: "legal" },
  { id: "page-terms", path: "/naudojimo-salygos", title: "Naudojimo sąlygos", sourceId: "source-route-naudojimo-salygos", kind: "legal" },
] as const;

type PageDefinition = {
  id: string;
  path: `/${string}`;
  title: string;
  sourceId: string;
  kind: PageRecord["kind"];
  parentPageId?: string;
  functionId?: string;
};

function pageFromDefinition(definition: PageDefinition): PageRecord {
  const title = sourceText(definition.title, evidence(definition.sourceId));
  const blocks: Block[] = [
    {
      id: `${definition.id}-identity`,
      type: "hero",
      publication: "published",
      data: { heading: title },
      parity,
    },
  ];

  if (definition.functionId) {
    blocks.push({
      id: `${definition.id}-${definition.functionId}`,
      type: "function",
      publication: "published",
      data: { functionId: definition.functionId },
      parity,
    });
  }

  return {
    id: definition.id,
    path: definition.path,
    kind: definition.kind,
    ...(definition.parentPageId ? { parentPageId: definition.parentPageId } : {}),
    title,
    navigationTitle: title,
    publication: "published",
    blocks,
    seo: { title },
    parity,
  };
}

const staticPages = staticPageDefinitions.map((definition) => pageFromDefinition(definition));

const applicationPages = applications.map((application) =>
  pageFromDefinition({
    id: `page-application-${application.id}`,
    path: application.href,
    title: application.title,
    sourceId: "source-products",
    kind: "detail",
    parentPageId: "page-products",
  }),
);

const materialPages = materials.map((material) =>
  pageFromDefinition({
    id: `page-material-${material.slug}`,
    path: `/akmuo/${material.slug}`,
    title: material.name,
    sourceId: `source-material-${material.slug}`,
    kind: "detail",
    parentPageId: "page-materials",
  }),
);

const projectPages = projects.map((project) =>
  pageFromDefinition({
    id: `page-project-${project.slug}`,
    path: `/projektai/${project.slug}`,
    title: project.displayLabel,
    sourceId: "source-projects",
    kind: "detail",
    parentPageId: "page-projects",
  }),
);

const pages: readonly PageRecord[] = [
  ...staticPages,
  ...applicationPages,
  ...materialPages,
  ...projectPages,
];

const functions: readonly FunctionRecord[] = [
  {
    id: "function-material-selector",
    type: "selector",
    implementationKey: "granit-decor.material-explorer",
    config: {
      capabilities: ["search", "category-filter", "sort", "saved-items", "comparison", "quick-view"],
      itemCount: materials.length,
    },
    evidence: evidence("source-materials-index"),
    publication: "published",
    testFixtureIds: ["fixture-material-search", "fixture-material-filter", "fixture-material-save", "fixture-material-compare"],
    parity,
    integrationStatus: "complete",
  },
  {
    id: "function-project-planner",
    type: "form",
    implementationKey: "granit-decor.project-planner",
    config: {
      delivery: "local-summary-only",
      fileSelection: true,
      persistentDraft: true,
      transmitsData: false,
    },
    evidence: evidence("source-route-projektas"),
    publication: "published",
    testFixtureIds: ["fixture-planner-validation", "fixture-planner-file", "fixture-planner-summary"],
    parity,
    integrationStatus: "frontend-only",
    integrationBlocker: {
      sourceId: "source-route-projektas",
      functionId: "function-project-planner",
      publication: "published",
      rationale: "CRM, email, and upload delivery credentials have not been supplied; the UI states this honestly.",
    },
    blockedReason: "CRM, email, and upload delivery credentials have not been supplied; the UI states this honestly.",
  },
];

const media: readonly MediaAsset[] = [
  ...templateMedia,
  ...materialMedia,
  ...portfolioMedia,
];

const pagesByPath = new Map(pages.map((page) => [page.path, page.id]));

function coverageDestinations(source: SourceRecord): CoverageDestination[] {
  if (source.id === "source-home") return [{ kind: "page", id: "page-home" }];
  if (source.id === "source-products") {
    return [
      { kind: "page", id: "page-products" },
      ...applicationPages.map((page) => ({ kind: "page" as const, id: page.id })),
    ];
  }
  if (source.id === "source-materials-index") {
    return [
      { kind: "page", id: "page-materials" },
      { kind: "function", id: "function-material-selector" },
    ];
  }
  if (source.id === "source-projects") {
    return [
      { kind: "page", id: "page-projects" },
      ...projectPages.map((page) => ({ kind: "page" as const, id: page.id })),
    ];
  }
  if (source.id === "source-logo") return [{ kind: "media", id: "media-logo" }];
  if (source.id === "source-hero-film") return [{ kind: "media", id: "media-hero-film" }];

  if (source.id.startsWith("source-material-")) {
    const slug = source.id.slice("source-material-".length);
    return [
      { kind: "page", id: `page-material-${slug}` },
      { kind: "media", id: `media-material-${slug}` },
    ];
  }

  if (source.id.startsWith("source-portfolio-")) {
    const slug = source.id.slice("source-portfolio-".length);
    return [{ kind: "media", id: `media-portfolio-${slug}` }];
  }

  if (source.id.startsWith("source-route-") && source.kind === "url") {
    const path = new URL(source.url).pathname.replace(/\/$/, "") || "/";
    const pageId = pagesByPath.get(path as `/${string}`);
    return pageId ? [{ kind: "page", id: pageId }] : [];
  }

  return [];
}

const sourceCoverage: readonly SourceCoverageRecord[] = sources.map((source) => {
  const destinations = coverageDestinations(source);
  const firstDestination = destinations[0];
  if (!firstDestination) {
    return {
      sourceId: source.id,
      status: "blocked",
      reviewedAt,
      rationale: "The source is inventoried, but its destination mapping is not complete.",
    };
  }
  return {
    sourceId: source.id,
    status: "adapted",
    destinations: [firstDestination, ...destinations.slice(1)],
    reviewedAt,
    note: "The verified source content is represented in the reference redesign.",
  };
});

const pageIdByNavigationId: Readonly<Record<string, string>> = {
  gaminiai: "page-products",
  akmuo: "page-materials",
  projektai: "page-projects",
  "kaip-dirbame": "page-process",
  profesionalams: "page-professionals",
  "apie-mus": "page-about",
  kontaktai: "page-contact",
  memorialai: "page-memorials",
};

export const granitDecorSiteManifest = assertValidSiteManifest({
  schemaVersion: "1.0.0",
  siteId: "granit-decor",
  defaultLocale: "lt-LT",
  brand: {
    name: sourceText("Granit Decor", evidence("source-home")),
    legalName: sourceText("Granit Decor, UAB", evidence("source-route-kontaktai")),
    logoMediaId: "media-logo",
    accent: "#7b3025",
  },
  homePageId: "page-home",
  primaryPageId: "page-planner",
  sources,
  sourceCoverage,
  media,
  functions,
  pages,
  navigation: {
    primary: primaryNavigation.map((item) => ({
      id: `nav-${item.id}`,
      label: sourceText(item.label, evidence("source-home", "primary navigation")),
      target: { kind: "page", pageId: pageIdByNavigationId[item.id] },
    })),
    utility: utilityNavigation.map((item) => ({
      id: `nav-${item.id}`,
      label: sourceText(item.label, evidence("source-home", "utility navigation")),
      target: { kind: "page", pageId: pageIdByNavigationId[item.id] },
    })),
    footer: [
      {
        id: "nav-project-planner",
        label: uiText("Aptarkime projektą"),
        target: { kind: "page", pageId: "page-planner" },
      },
      {
        id: "nav-journal",
        label: sourceText("Žurnalas", evidence("source-route-zurnalas")),
        target: { kind: "page", pageId: "page-journal" },
      },
      {
        id: "nav-privacy",
        label: uiText("Privatumas"),
        target: { kind: "page", pageId: "page-privacy" },
      },
      {
        id: "nav-terms",
        label: uiText("Naudojimo sąlygos"),
        target: { kind: "page", pageId: "page-terms" },
      },
    ],
  },
} satisfies SiteManifest, "draft");
