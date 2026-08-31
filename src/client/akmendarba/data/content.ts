export type VerificationStatus = "verified-public" | "unverified" | "requires-client-confirmation";

export type ImageAsset = {
  src: string;
  alt: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
};

export type ApplicationId = "paminklai" | "kapo-dengimai" | "aksesuarai" | "apdaila";
export type ApplicationGroupId = "produkcija";

export type ApplicationRecord = {
  id: ApplicationId;
  slug: ApplicationId;
  title: string;
  shortTitle: string;
  description: string;
  planningNote: string;
  group: ApplicationGroupId;
  featured: boolean;
  keywords: readonly string[];
  href: `/${ApplicationId}`;
  image: ImageAsset;
};

export type ApplicationGroup = {
  id: ApplicationGroupId;
  title: string;
  description: string;
  applicationIds: readonly ApplicationId[];
};

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

export type ProjectVisualCategory = string;

export type ProjectRecord = {
  id: string;
  slug: string;
  title: null;
  displayLabel: string;
  detailsStatus: "unverified";
  categories: readonly ProjectVisualCategory[];
  image: ImageAsset;
  imageOrientation: "portrait" | "landscape";
  sourceAssetId: string;
  featured: boolean;
  stone: null;
  location: null;
  completedAt: null;
  collaborators: null;
};

export type MaterialCategoryId = "granitas" | "marmuras";

export type MaterialCategory = {
  id: MaterialCategoryId;
  slug: MaterialCategoryId;
  name: string;
  description: string;
  visualCharacter: string;
  href: `/akmuo?tipas=${MaterialCategoryId}`;
};

export type ProfessionalCollaborationItem = {
  id: string;
  title: string;
  description: string;
};

export type ContactField = {
  value: string | null;
  label: string;
  status: VerificationStatus;
};

export type SiteMetadata = {
  name: string;
  locale: "lt-LT";
  title: string;
  description: string;
  productionUrl: string;
  serviceAreaLabel: string;
  contact: {
    phone: ContactField;
    email: ContactField;
    address: ContactField;
    openingHours: ContactField;
    mapUrl: ContactField;
    legalName: ContactField;
    companyCode: ContactField;
  };
};

export const primaryNavigation = [
  { id: "apie-mus", label: "Apie mus", href: "/apie-mus" },
  { id: "produkcija", label: "Produkcija", href: "/paminklai" },
  { id: "galerija", label: "Galerija", href: "/galerija" },
  { id: "kontaktai", label: "Kontaktai", href: "/kontaktai" },
] as const satisfies readonly NavigationItem[];

export const utilityNavigation: readonly NavigationItem[] = [];

export const siteCopy = {
  hero: {
    eyebrow: "Akmendarba",
    title: "Granito blokai ir plokštės",
    body: "Aukščiausios kokybės iš Skandinavijos.",
    primaryAction: { label: "Vidaus ir išorės apdaila", href: "/apdaila" },
    secondaryAction: { label: "Galerija", href: "/galerija" },
  },
  introduction: {
    title: "Akmuo — ilgaamžė statybinė medžiaga.",
    body: "Naujausios technologijos suteikia galimybę apdirbti vis daugiau akmens rūšių, naudojamų statyboje ir interjero kūrime.",
  },
  professionals: {
    title: "Granito ir marmuro gaminiai.",
    body: "Įmonės patalpose sumontuota virš 20 akmens apdirbimo staklių, suteikiančių galimybę greitai ir kokybiškai apdirbti granito bei marmuro gaminius.",
    action: { label: "Apie mus", href: "/apie-mus" },
  },
  finalCallToAction: {
    title: "Informacija ir užsakymų priėmimas",
    body: "+370 677 16667 · info@akmendarba.lt",
    action: { label: "Kontaktai", href: "/kontaktai" },
  },
} as const;

export const applicationGroups = [
  {
    id: "produkcija",
    title: "Produkcija",
    description: "Akmendarba viešai skelbiamos gaminių ir darbų kategorijos.",
    applicationIds: ["paminklai", "kapo-dengimai", "aksesuarai", "apdaila"],
  },
] as const satisfies readonly ApplicationGroup[];

export const applications = [
  {
    id: "paminklai",
    slug: "paminklai",
    title: "Paminklai ir paminklų gamyba",
    shortTitle: "Paminklai",
    description: "Paminklai iš granito blokų, atkeliaujančių iš Skandinavijos.",
    planningNote: "Gamybos metu sprendimas derinamas su užsakovu.",
    group: "produkcija",
    featured: true,
    keywords: ["paminklai", "paminklų gamyba", "granitas", "Šiauliai", "Lietuva"],
    href: "/paminklai",
    image: {
      src: "/client/akmendarba/source/paminklai.jpg",
      alt: "Akmendarba paminklų gamybos pavyzdys.",
    },
  },
  {
    id: "kapo-dengimai",
    slug: "kapo-dengimai",
    title: "Kapo dengimai granito plokštėmis",
    shortTitle: "Kapo dengimai",
    description: "Įvairaus dydžio bei spalvų kapo uždengimai iš granito plokščių.",
    planningNote: "Kapo dengimai atliekami Šiauliuose bei visoje Lietuvoje.",
    group: "produkcija",
    featured: true,
    keywords: ["kapo dengimas", "granito plokštės", "Šiauliai", "Lietuva"],
    href: "/kapo-dengimai",
    image: {
      src: "/client/akmendarba/source/kapu-dengimas-plokstemis.jpg",
      alt: "Kapo dengimo granito plokštėmis pavyzdys.",
    },
  },
  {
    id: "aksesuarai",
    slug: "aksesuarai",
    title: "Kapo aksesuarai",
    shortTitle: "Aksesuarai",
    description: "Kapo atributika, norimo teksto užrašymas ir pasirinkto vaizdo piešimas.",
    planningNote: "Kapų aksesuarai gaminami Šiauliuose ir visoje Lietuvoje.",
    group: "produkcija",
    featured: true,
    keywords: ["kapo aksesuarai", "atributika", "užrašai", "vaizdai"],
    href: "/aksesuarai",
    image: {
      src: "/client/akmendarba/source/aksesuarai-kapams.jpg",
      alt: "Akmendarba kapo aksesuarų pavyzdys.",
    },
  },
  {
    id: "apdaila",
    slug: "apdaila",
    title: "Granito plokštės vidaus ir išorės apdailai",
    shortTitle: "Vidaus ir išorės apdaila",
    description: "Granito plokščių pjovimas ir apdirbimas vidaus bei išorės apdailai.",
    planningNote: "Granito plokštės siūlomos Šiauliuose ir visoje Lietuvoje.",
    group: "produkcija",
    featured: true,
    keywords: ["granito plokštės", "vidaus apdaila", "išorės apdaila", "pjovimas", "apdirbimas"],
    href: "/apdaila",
    image: {
      src: "/client/akmendarba/source/Apdaila-naudojant-akmeni.jpg",
      alt: "Vidaus apdailos naudojant akmenį pavyzdys.",
    },
  },
] as const satisfies readonly ApplicationRecord[];

/** The source does not publish a separate, named process page. */
export const processSteps: readonly ProcessStep[] = [];

/** Gallery images are grouped by source category, not presented as named case studies. */
export const projects: readonly ProjectRecord[] = [];

/** The source mentions granite and marble but does not publish a selectable material catalogue. */
export const materialCategories: readonly MaterialCategory[] = [];

/** The source does not publish a separate professional-partner programme. */
export const professionalCollaboration: readonly ProfessionalCollaborationItem[] = [];

export const gallerySections = [
  {
    id: "paminklu-galerija",
    label: "Paminklų galerija",
    href: "/galerija/paminklu-galerija",
    image: "/client/akmendarba/source/paminklas-keliu-daliu-23.jpg",
  },
  {
    id: "kapo-dengimu-galerija",
    label: "Kapo dengimų galerija",
    href: "/galerija/kapo-dengimu-galerija",
    image: "/client/akmendarba/source/kapo-dengimas-24.jpg",
  },
  {
    id: "aksesuaru-galerija",
    label: "Aksesuarų galerija",
    href: "/galerija/aksesuaru-galerija",
    image: "/client/akmendarba/source/Aksesuarai-is-akmens-16.jpg",
  },
  {
    id: "apdailos-galerija",
    label: "Apdailos galerija",
    href: "/galerija/apdailos-galerija",
    image: "/client/akmendarba/source/Marmuro-apdaila-1.jpg",
  },
] as const;

const verifiedField = (value: string, label: string): ContactField => ({
  value,
  label,
  status: "verified-public",
});

export const siteMetadata: SiteMetadata = {
  name: "Akmendarba",
  locale: "lt-LT",
  title: "Paminklų gamyba, kapo dengimas, granito plokštės ir blokai | Akmendarba",
  description: "Paminklų gamyba, kapo dengimas, kapo aksesuarai ir granito plokščių apdirbimas vidaus bei išorės apdailai.",
  productionUrl: "https://akmendarba.lt",
  serviceAreaLabel: "Šiauliai ir visa Lietuva",
  contact: {
    phone: verifiedField("+370 677 16667", "Informacija ir užsakymų priėmimas"),
    email: verifiedField("info@akmendarba.lt", "Informacija ir užsakymų priėmimas"),
    address: verifiedField("Saulėtekio g. 47, Einoraičių kaimas, Šiaulių rajonas LT-80141", "Būstinė"),
    openingHours: { value: null, label: "Šaltinyje darbo laikas nenurodytas", status: "unverified" },
    mapUrl: verifiedField("https://www.google.com/maps/search/?api=1&query=Saul%C4%97tekio+g.+47%2C+Einorai%C4%8Diai%2C+%C5%A0iauli%C5%B3+r.", "Žemėlapis"),
    legalName: verifiedField("Akmendarba, UAB", "Juridinis pavadinimas"),
    companyCode: verifiedField("300526494", "Įmonės kodas"),
  },
};
