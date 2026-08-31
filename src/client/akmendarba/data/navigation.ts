import {
  applications,
  gallerySections,
  primaryNavigation,
  type ImageAsset,
} from "@/client/akmendarba/data/content";

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

const productionTiles = applications.map((item) => ({
  id: item.id,
  label: item.shortTitle,
  href: item.href,
  image: item.image,
})) satisfies readonly MegaNavigationTile[];

const galleryTiles = gallerySections.map((item) => ({
  id: item.id,
  label: item.label,
  href: item.href,
  image: { src: item.image, alt: "" },
})) satisfies readonly MegaNavigationTile[];

export const megaNavigation = {
  "apie-mus": {
    id: "apie-mus",
    label: "Apie mus",
    href: "/apie-mus",
    behavior: "direct",
  },
  produkcija: {
    id: "produkcija",
    label: "Produkcija",
    href: "/paminklai",
    behavior: "panel",
    ariaLabel: "Akmendarba produkcija",
    layout: "five",
    tiles: productionTiles,
    railLinks: [],
  },
  galerija: {
    id: "galerija",
    label: "Galerija",
    href: "/galerija",
    behavior: "panel",
    ariaLabel: "Akmendarba galerijos",
    layout: "five",
    tiles: galleryTiles,
    railLinks: [{ label: "Visa galerija", href: "/galerija" }],
  },
  kontaktai: {
    id: "kontaktai",
    label: "Kontaktai",
    href: "/kontaktai",
    behavior: "direct",
  },
} as const satisfies Record<MegaMenuId, MegaNavigationMenu>;

export const megaNavigationItems = primaryNavigation.map(
  (item) => megaNavigation[item.id],
) as readonly MegaNavigationMenu[];

export type NavigationSearchGroup = "gaminiai" | "akmuo" | "projektai" | "puslapiai" | "zurnalas";

export type NavigationSearchItem = {
  id: string;
  label: string;
  href: MegaNavigationHref;
  group: NavigationSearchGroup;
  keywords: readonly string[];
};

/** Search is not offered by the public source and is disabled in the site config. */
export const navigationSearchIndex: readonly NavigationSearchItem[] = [];
