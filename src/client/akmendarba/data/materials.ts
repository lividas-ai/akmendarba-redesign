import {
  accessoryGallery,
  finishGallery,
  graveCoveringDedicatedGallery,
  monumentMultiPiece,
  monumentOnePiece,
} from "@/content/akmendarba";

export type MaterialCategory =
  | "medziaga-ir-gamyba"
  | "vienos-dalies-paminklai"
  | "keliu-daliu-paminklai"
  | "kapo-dengimai"
  | "aksesuarai"
  | "apdaila";

export interface Material {
  slug: string;
  name: string;
  category: MaterialCategory;
  categoryName: string;
  sourceUrl: string;
  sourcePageUrl: string;
  sourceAssetName: string;
  optimizedUrl: string;
  localPath: string;
  alt: string;
  featured: boolean;
  needsConfirmation: boolean;
  sourceContext: string;
  notes: string;
}

export interface MaterialCollection {
  id: MaterialCategory;
  name: string;
  shortName: string;
  description: string;
  sourcePageUrl: string;
  representativeImage: string;
}

type SourceImage = Readonly<{ src: string; alt: string; sourcePageUrl?: string }>;

type GalleryDefinition = {
  category: MaterialCategory;
  categoryName: string;
  itemName: string;
  sourcePageUrl: string;
  sourceContext: string;
};

const sourceMediaRoot = "https://akmendarba.lt/wp-content/uploads";
const confirmationNote =
  "Tai viešai paskelbtas Akmendarba vaizdinis pavyzdys, o ne sandėlio prekė. Tikslų akmenį, atspalvį, matmenis ir prieinamumą patvirtinkite su įmone.";

function assetName(path: string) {
  return path.split("/").at(-1) ?? path;
}

function localToSourceUrl(path: string, month = "2018/04") {
  return `${sourceMediaRoot}/${month}/${assetName(path)}`;
}

function slugFromAsset(path: string) {
  return assetName(path)
    .replace(/\.[a-z0-9]+$/i, "")
    .toLocaleLowerCase("lt-LT")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function galleryMaterials(
  images: readonly SourceImage[],
  definition: GalleryDefinition,
): Material[] {
  return images.map((image) => ({
    slug: slugFromAsset(image.src),
    name: definition.itemName,
    category: definition.category,
    categoryName: definition.categoryName,
    sourceUrl: localToSourceUrl(image.src),
    sourcePageUrl: image.sourcePageUrl ?? definition.sourcePageUrl,
    sourceAssetName: assetName(image.src),
    optimizedUrl: image.src,
    localPath: image.src,
    alt: image.alt,
    featured: false,
    needsConfirmation: true,
    sourceContext: definition.sourceContext,
    notes: confirmationNote,
  }));
}

const homepageReferences: readonly Material[] = [
  {
    slug: "paminklu-gamyba-karjeras",
    name: "Paminklų gamyba",
    category: "medziaga-ir-gamyba",
    categoryName: "Medžiaga ir gamyba",
    sourceUrl: `${sourceMediaRoot}/2018/06/Karjeras-s.jpg`,
    sourcePageUrl: "https://akmendarba.lt/",
    sourceAssetName: "Karjeras-s.jpg",
    optimizedUrl: "/client/akmendarba/source/Karjeras-s.jpg",
    localPath: "/client/akmendarba/source/Karjeras-s.jpg",
    alt: "Akmens karjero vaizdas iš Akmendarba pagrindinio puslapio",
    featured: true,
    needsConfirmation: true,
    sourceContext: "Akmendarba pagrindinio puslapio skaidrė apie paminklų gamybą.",
    notes: confirmationNote,
  },
  {
    slug: "granito-blokai-ir-plokstes",
    name: "Granito blokai ir plokštės",
    category: "medziaga-ir-gamyba",
    categoryName: "Medžiaga ir gamyba",
    sourceUrl: `${sourceMediaRoot}/2018/05/cava_bianco_carrara_2.jpg`,
    sourcePageUrl: "https://akmendarba.lt/",
    sourceAssetName: "cava_bianco_carrara_2.jpg",
    optimizedUrl: "/client/akmendarba/source/cava_bianco_carrara_2.jpg",
    localPath: "/client/akmendarba/source/cava_bianco_carrara_2.jpg",
    alt: "Akmens gavybos vieta iš Akmendarba pagrindinio puslapio",
    featured: true,
    needsConfirmation: true,
    sourceContext: "Akmendarba pagrindinio puslapio skaidrė „Granito blokai ir plokštės“.",
    notes: confirmationNote,
  },
  {
    slug: "vidaus-ir-isores-apdaila",
    name: "Vidaus ir išorės apdaila",
    category: "medziaga-ir-gamyba",
    categoryName: "Medžiaga ir gamyba",
    sourceUrl: `${sourceMediaRoot}/2018/05/10.jpg`,
    sourcePageUrl: "https://akmendarba.lt/",
    sourceAssetName: "10.jpg",
    optimizedUrl: "/client/akmendarba/source/10.jpg",
    localPath: "/client/akmendarba/source/10.jpg",
    alt: "Akmens apdailos interjero vaizdas iš Akmendarba pagrindinio puslapio",
    featured: true,
    needsConfirmation: true,
    sourceContext: "Akmendarba pagrindinio puslapio skaidrė apie vidaus ir išorės apdailą.",
    notes: confirmationNote,
  },
  {
    slug: "paminklai-paslaugos-vaizdas",
    name: "Paminklai",
    category: "medziaga-ir-gamyba",
    categoryName: "Medžiaga ir gamyba",
    sourceUrl: `${sourceMediaRoot}/2018/04/paminklai.jpg`,
    sourcePageUrl: "https://akmendarba.lt/",
    sourceAssetName: "paminklai.jpg",
    optimizedUrl: "/client/akmendarba/source/paminklai.jpg",
    localPath: "/client/akmendarba/source/paminklai.jpg",
    alt: "Akmendarba paminklų paslaugos vaizdas",
    featured: false,
    needsConfirmation: true,
    sourceContext: "Akmendarba pagrindiniame puslapyje rodomas paminklų paslaugos vaizdas.",
    notes: confirmationNote,
  },
  {
    slug: "aksesuarai-paslaugos-vaizdas",
    name: "Aksesuarai",
    category: "medziaga-ir-gamyba",
    categoryName: "Medžiaga ir gamyba",
    sourceUrl: `${sourceMediaRoot}/2018/04/aksesuarai-kapams.jpg`,
    sourcePageUrl: "https://akmendarba.lt/",
    sourceAssetName: "aksesuarai-kapams.jpg",
    optimizedUrl: "/client/akmendarba/source/aksesuarai-kapams.jpg",
    localPath: "/client/akmendarba/source/aksesuarai-kapams.jpg",
    alt: "Akmendarba akmens aksesuarų paslaugos vaizdas",
    featured: false,
    needsConfirmation: true,
    sourceContext: "Akmendarba pagrindiniame puslapyje rodomas akmens aksesuarų paslaugos vaizdas.",
    notes: confirmationNote,
  },
  {
    slug: "apdaila-paslaugos-vaizdas",
    name: "Apdaila",
    category: "medziaga-ir-gamyba",
    categoryName: "Medžiaga ir gamyba",
    sourceUrl: `${sourceMediaRoot}/2018/04/Apdaila-naudojant-akmeni.jpg`,
    sourcePageUrl: "https://akmendarba.lt/",
    sourceAssetName: "Apdaila-naudojant-akmeni.jpg",
    optimizedUrl: "/client/akmendarba/source/Apdaila-naudojant-akmeni.jpg",
    localPath: "/client/akmendarba/source/Apdaila-naudojant-akmeni.jpg",
    alt: "Akmendarba akmens apdailos paslaugos vaizdas",
    featured: false,
    needsConfirmation: true,
    sourceContext: "Akmendarba pagrindiniame puslapyje rodomas akmens apdailos paslaugos vaizdas.",
    notes: confirmationNote,
  },
];

const onePieceMonuments = galleryMaterials(monumentOnePiece, {
  category: "vienos-dalies-paminklai",
  categoryName: "Vienos dalies paminklai",
  itemName: "Vienos dalies paminklas",
  sourcePageUrl: "https://akmendarba.lt/galerija/paminklu-galerija/",
  sourceContext: "Akmendarba viešai paskelbtas vienos dalies granito paminklo pavyzdys.",
});

const multiPieceMonuments = galleryMaterials(monumentMultiPiece, {
  category: "keliu-daliu-paminklai",
  categoryName: "Kelių dalių paminklai",
  itemName: "Kelių dalių paminklas",
  sourcePageUrl: "https://akmendarba.lt/galerija/paminklu-galerija/",
  sourceContext: "Akmendarba viešai paskelbtas kelių dalių granito paminklo pavyzdys.",
});

// The master gallery contains two grave-covering visuals omitted from the
// dedicated child gallery. Include both so the selector represents the union
// of every image that visitors can see on the public source website.
const graveCoveringUnion: readonly SourceImage[] = [
  ...graveCoveringDedicatedGallery,
  {
    src: "/client/akmendarba/source/kapo-dengimas-5.jpg",
    alt: "Akmendarba atliktas kapo dengimas granito plokštėmis",
    sourcePageUrl: "https://akmendarba.lt/galerija/",
  },
  {
    src: "/client/akmendarba/source/kapu-dengimas-plokstemis.jpg",
    alt: "Akmendarba atliktas kapo dengimas granito plokštėmis",
    sourcePageUrl: "https://akmendarba.lt/",
  },
];

const graveCoverings = galleryMaterials(graveCoveringUnion, {
  category: "kapo-dengimai",
  categoryName: "Kapo dengimai",
  itemName: "Kapo dengimo pavyzdys",
  sourcePageUrl: "https://akmendarba.lt/galerija/kapo-dengimu-galerija/",
  sourceContext: "Akmendarba viešai paskelbtas kapo dengimo granito plokštėmis pavyzdys.",
});

const accessories = galleryMaterials(accessoryGallery, {
  category: "aksesuarai",
  categoryName: "Aksesuarai",
  itemName: "Akmens aksesuaras",
  sourcePageUrl: "https://akmendarba.lt/galerija/aksesuaru-galerija/",
  sourceContext: "Akmendarba viešai paskelbtas akmens aksesuaro pavyzdys.",
});

const finishes = galleryMaterials(finishGallery, {
  category: "apdaila",
  categoryName: "Apdaila",
  itemName: "Marmuro apdaila",
  sourcePageUrl: "https://akmendarba.lt/galerija/apdailos-galerija/",
  sourceContext: "Akmendarba viešai paskelbtas akmens plokščių apdailos pavyzdys.",
});

export const materialCollections: readonly MaterialCollection[] = [
  {
    id: "medziaga-ir-gamyba",
    name: "Medžiaga ir gamyba",
    shortName: "Medžiaga",
    description: "Pagrindiniame puslapyje rodomi akmens, gamybos ir apdailos vaizdai.",
    sourcePageUrl: "https://akmendarba.lt/",
    representativeImage: homepageReferences[1].localPath,
  },
  {
    id: "vienos-dalies-paminklai",
    name: "Vienos dalies paminklai",
    shortName: "Vienos dalies",
    description: "Viešos paminklų galerijos vienos dalies darbai.",
    sourcePageUrl: "https://akmendarba.lt/galerija/paminklu-galerija/",
    representativeImage: onePieceMonuments[0].localPath,
  },
  {
    id: "keliu-daliu-paminklai",
    name: "Kelių dalių paminklai",
    shortName: "Kelių dalių",
    description: "Viešos paminklų galerijos kelių dalių darbai.",
    sourcePageUrl: "https://akmendarba.lt/galerija/paminklu-galerija/",
    representativeImage: multiPieceMonuments[0].localPath,
  },
  {
    id: "kapo-dengimai",
    name: "Kapo dengimai",
    shortName: "Dengimai",
    description: "Viešai skelbiami kapo dengimo granito plokštėmis pavyzdžiai.",
    sourcePageUrl: "https://akmendarba.lt/galerija/kapo-dengimu-galerija/",
    representativeImage: graveCoverings[0].localPath,
  },
  {
    id: "aksesuarai",
    name: "Aksesuarai",
    shortName: "Aksesuarai",
    description: "Viešai skelbiami akmens atributikos pavyzdžiai.",
    sourcePageUrl: "https://akmendarba.lt/galerija/aksesuaru-galerija/",
    representativeImage: accessories[0].localPath,
  },
  {
    id: "apdaila",
    name: "Apdaila",
    shortName: "Apdaila",
    description: "Viešai skelbiami akmens plokščių apdailos pavyzdžiai.",
    sourcePageUrl: "https://akmendarba.lt/galerija/apdailos-galerija/",
    representativeImage: finishes[0].localPath,
  },
] as const;

/**
 * Complete union of stone and stone-work visuals rendered by the public
 * Akmendarba website: six homepage visuals and 131 unique gallery images.
 * Entries are visual references, never claims of named stock.
 */
export const materials: readonly Material[] = [
  ...homepageReferences,
  ...onePieceMonuments,
  ...multiPieceMonuments,
  ...graveCoverings,
  ...accessories,
  ...finishes,
];

export const materialCategoryLabels = Object.fromEntries(
  materialCollections.map((collection) => [collection.id, collection.name]),
) as Record<MaterialCategory, string>;
