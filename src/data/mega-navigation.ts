import {
  applications,
  materialCategories,
  primaryNavigation,
  projects,
  type ApplicationId,
  type ImageAsset,
  type MaterialCategoryId,
} from "@/data/content";
import { materials } from "@/data/materials";

export type MegaMenuId = (typeof primaryNavigation)[number]["id"];

export type MegaNavigationHref = `/${string}`;

export type MegaNavigationTile = {
  id: string;
  label: string;
  href: MegaNavigationHref;
  image: ImageAsset;
};

export type MegaNavigationRailLink = {
  label: string;
  href: MegaNavigationHref;
};

type MegaNavigationBase = {
  id: MegaMenuId;
  label: string;
  href: MegaNavigationHref;
};

export type MegaNavigationPanel = MegaNavigationBase & {
  behavior: "panel";
  ariaLabel: string;
  layout: "three" | "five" | "eight";
  presentation?: "plain";
  tiles: readonly MegaNavigationTile[];
  railLinks: readonly MegaNavigationRailLink[];
};

export type MegaNavigationDirectLink = MegaNavigationBase & {
  behavior: "direct";
};

export type MegaNavigationMenu = MegaNavigationPanel | MegaNavigationDirectLink;

const materialMenuImages: Record<MaterialCategoryId, ImageAsset> = {
  granitas: {
    src: "/assets/materials/cosmic-black.webp",
    alt: "Tamsus kontrastingo mineralinio rašto granitas.",
  },
  marmuras: {
    src: "/assets/materials/calacatta.webp",
    alt: "Šviesus marmuras su kryptingomis pilkomis gyslomis.",
  },
  kvarcitas: {
    src: "/assets/materials/patagonia.webp",
    alt: "Kontrastingas sluoksniuoto rašto kvarcitas.",
  },
  oniksas: {
    src: "/assets/materials/bianco-onyx.webp",
    alt: "Šviesus sluoksniuoto rašto oniksas.",
  },
  travertinas: {
    src: "/assets/materials/classico.webp",
    alt: "Šiltas linijinio rašto travertinas.",
  },
};

function applicationTile(id: ApplicationId): MegaNavigationTile {
  const application = applications.find((item) => item.id === id);

  if (!application) {
    throw new Error(`Unknown application used in mega navigation: ${id}`);
  }

  return {
    id: application.id,
    label: application.shortTitle,
    href: application.href,
    image: application.image,
  };
}

function materialCategoryTile(id: MaterialCategoryId): MegaNavigationTile {
  const category = materialCategories.find((item) => item.id === id);

  if (!category) {
    throw new Error(`Unknown material category used in mega navigation: ${id}`);
  }

  return {
    id: category.id,
    label: category.name,
    href: category.href,
    image: materialMenuImages[id],
  };
}

function projectTile(id: (typeof projects)[number]["id"]): MegaNavigationTile {
  const project = projects.find((item) => item.id === id);

  if (!project) {
    throw new Error(`Unknown project used in mega navigation: ${id}`);
  }

  return {
    id: project.id,
    label: project.displayLabel,
    href: `/projektai/${project.slug}`,
    image: project.image,
  };
}

export const megaNavigation = {
  gaminiai: {
    id: "gaminiai",
    label: "Gaminiai",
    href: "/gaminiai",
    behavior: "panel",
    ariaLabel: "Gaminiai pagal paskirtį",
    layout: "eight",
    tiles: [
      applicationTile("virtuves-stalvirsiai"),
      applicationTile("vonios-stalvirsiai"),
      applicationTile("zidiniu-apdaila"),
      applicationTile("sienu-apdaila"),
      applicationTile("grindu-danga"),
      applicationTile("laiptai-ir-laiptu-pakopos"),
      applicationTile("akmens-palanges"),
      applicationTile("kolonos"),
    ],
    railLinks: [
      { label: "Visi gaminiai", href: "/gaminiai" },
      { label: "Akmens stalai", href: "/gaminiai/akmens-stalai" },
      { label: "Vidaus baldai", href: "/gaminiai/vidaus-baldai" },
      { label: "Lauko baldai", href: "/gaminiai/lauko-baldai" },
      { label: "Fasadų apdaila", href: "/gaminiai/fasadu-apdaila" },
      { label: "Antkapiai ir paminklai", href: "/gaminiai/antkapiai-ir-paminklai" },
      { label: "Aptarti projektą", href: "/projektas" },
    ],
  },
  akmuo: {
    id: "akmuo",
    label: "Akmuo",
    href: "/akmuo",
    behavior: "panel",
    ariaLabel: "Natūralaus akmens rūšys",
    layout: "five",
    tiles: [
      materialCategoryTile("granitas"),
      materialCategoryTile("marmuras"),
      materialCategoryTile("kvarcitas"),
      materialCategoryTile("oniksas"),
      materialCategoryTile("travertinas"),
    ],
    railLinks: [
      { label: "Visa akmens kolekcija", href: "/akmuo" },
      { label: "Išsaugoti akmenys", href: "/akmuo?rodyti=issaugoti" },
      { label: "Kiti užsakomi paviršiai", href: "/akmuo#other-surfaces-title" },
      { label: "Gaminiai", href: "/gaminiai" },
      { label: "Aptarti medžiagos pasirinkimą", href: "/projektas" },
    ],
  },
  projektai: {
    id: "projektai",
    label: "Projektai",
    href: "/projektai",
    behavior: "panel",
    ariaLabel: "Atliktų darbų pavyzdžiai",
    layout: "five",
    tiles: [
      projectTile("granit-decor-darbai-25"),
      projectTile("granit-decor-darbai-30"),
      projectTile("granit-decor-darbai-03"),
      projectTile("granit-decor-darbai-24"),
      projectTile("granit-decor-darbai-31"),
    ],
    railLinks: [
      { label: "Visi atlikti darbai", href: "/projektai" },
      { label: "Darbai pagal erdvę", href: "/projektai#projects-index-title" },
      { label: "Gaminiai", href: "/gaminiai" },
      { label: "Akmens kolekcija", href: "/akmuo" },
      { label: "Aptarti panašų projektą", href: "/projektas" },
    ],
  },
  "kaip-dirbame": {
    id: "kaip-dirbame",
    label: "Kaip dirbame",
    href: "/kaip-dirbame",
    behavior: "panel",
    ariaLabel: "Granit Decor darbo eiga",
    layout: "three",
    presentation: "plain",
    tiles: [],
    railLinks: [
      { label: "Kaip dirbame", href: "/kaip-dirbame" },
      { label: "Parengti projekto planą", href: "/projektas" },
    ],
  },
  profesionalams: {
    id: "profesionalams",
    label: "Profesionalams",
    href: "/profesionalams",
    behavior: "direct",
  },
  "apie-mus": {
    id: "apie-mus",
    label: "Apie mus",
    href: "/apie-mus",
    behavior: "direct",
  },
} as const satisfies Record<MegaMenuId, MegaNavigationMenu>;

export const megaNavigationItems = primaryNavigation.map(
  (item) => megaNavigation[item.id],
) as readonly MegaNavigationMenu[];

export type NavigationSearchGroup =
  | "gaminiai"
  | "akmuo"
  | "projektai"
  | "puslapiai"
  | "zurnalas";

export type NavigationSearchItem = {
  id: string;
  label: string;
  href: MegaNavigationHref;
  group: NavigationSearchGroup;
  keywords: readonly string[];
};

const utilitySearchItems = [
  {
    id: "projekto-planas",
    label: "Projekto planas",
    href: "/projektas",
    group: "puslapiai",
    keywords: ["užklausa", "projektas", "brėžinys", "matmenys"],
  },
  {
    id: "kontaktai",
    label: "Kontaktai",
    href: "/kontaktai",
    group: "puslapiai",
    keywords: ["susisiekti", "Lentvaris"],
  },
  {
    id: "issaugoti-akmenys",
    label: "Išsaugoti akmenys",
    href: "/akmuo?rodyti=issaugoti",
    group: "puslapiai",
    keywords: ["mėgstami", "išsaugoti", "palyginti"],
  },
  {
    id: "memorialai",
    label: "Memorialai",
    href: "/memorialai",
    group: "puslapiai",
    keywords: ["paminklai", "antkapiai"],
  },
  {
    id: "zurnalas",
    label: "Žurnalas",
    href: "/zurnalas",
    group: "zurnalas",
    keywords: ["gidai", "akmens pasirinkimas", "priežiūra"],
  },
  {
    id: "naturalaus-akmens-prieziura",
    label: "Natūralaus akmens priežiūra",
    href: "/zurnalas/naturalaus-akmens-prieziura",
    group: "zurnalas",
    keywords: ["valymas", "dėmės", "kasdienė priežiūra"],
  },
  {
    id: "kaip-rinktis-virtuves-stalvirsi",
    label: "Kaip rinktis virtuvės stalviršį",
    href: "/zurnalas/kaip-rinktis-virtuves-stalvirsi",
    group: "zurnalas",
    keywords: ["virtuvė", "stalviršis", "akmens pasirinkimas"],
  },
] as const satisfies readonly NavigationSearchItem[];

export const navigationSearchIndex: readonly NavigationSearchItem[] = [
  ...primaryNavigation.map((item) => ({
    id: `page-${item.id}`,
    label: item.label,
    href: item.href,
    group: "puslapiai" as const,
    keywords: [] as readonly string[],
  })),
  ...applications.map((application) => ({
    id: `application-${application.id}`,
    label: application.shortTitle,
    href: application.href,
    group: "gaminiai" as const,
    keywords: application.keywords,
  })),
  ...materialCategories.map((category) => ({
    id: `material-category-${category.id}`,
    label: category.name,
    href: category.href,
    group: "akmuo" as const,
    keywords: [category.visualCharacter],
  })),
  ...materials.map((material) => ({
    id: `material-${material.slug}`,
    label: material.name,
    href: `/akmuo/${material.slug}` as MegaNavigationHref,
    group: "akmuo" as const,
    keywords: [material.category],
  })),
  ...projects.map((project) => ({
    id: `project-${project.id}`,
    label: project.displayLabel,
    href: `/projektai/${project.slug}` as MegaNavigationHref,
    group: "projektai" as const,
    keywords: project.categories,
  })),
  ...utilitySearchItems,
];
