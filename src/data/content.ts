export type VerificationStatus =
  | "verified-public"
  | "unverified"
  | "requires-client-confirmation";

export type ImageAsset = {
  src: string;
  alt: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
};

export type ApplicationId =
  | "virtuves-stalvirsiai"
  | "vonios-stalvirsiai"
  | "zidiniu-apdaila"
  | "sienu-apdaila"
  | "grindu-danga"
  | "laiptai-ir-laiptu-pakopos"
  | "akmens-palanges"
  | "kolonos"
  | "akmens-stalai"
  | "vidaus-baldai"
  | "lauko-baldai"
  | "fasadu-apdaila"
  | "antkapiai-ir-paminklai";

export type ApplicationGroupId =
  | "stalvirsiai-ir-vonia"
  | "interjero-apdaila"
  | "architekturos-detales"
  | "baldai-ir-objektai"
  | "eksterjeras-ir-atminimas";

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
  href: `/gaminiai/${ApplicationId}`;
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

export type ProjectVisualCategory =
  | "virtuve"
  | "vonios-erdve"
  | "interjero-elementas";

export type ProjectRecord = {
  id: string;
  /** Stable technical slug derived from the public source asset, not a project name. */
  slug: string;
  /** Intentionally null until the client approves a real project name. */
  title: null;
  /** Neutral, visually evident card label; never presented as a case-study name. */
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

export type MaterialCategoryId =
  | "granitas"
  | "marmuras"
  | "kvarcitas"
  | "oniksas"
  | "travertinas";

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
  status: "requires-client-confirmation";
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
  { id: "gaminiai", label: "Gaminiai", href: "/gaminiai" },
  { id: "akmuo", label: "Akmuo", href: "/akmuo" },
  { id: "projektai", label: "Projektai", href: "/projektai" },
  { id: "kaip-dirbame", label: "Kaip dirbame", href: "/kaip-dirbame" },
  { id: "profesionalams", label: "Profesionalams", href: "/profesionalams" },
  { id: "apie-mus", label: "Apie mus", href: "/apie-mus" },
] as const satisfies readonly NavigationItem[];

export const utilityNavigation = [
  { id: "kontaktai", label: "Kontaktai", href: "/kontaktai" },
  { id: "memorialai", label: "Memorialai", href: "/memorialai" },
] as const satisfies readonly NavigationItem[];

export const siteCopy = {
  hero: {
    eyebrow: "Natūralaus akmens gaminiai",
    title: "Akmens sprendimai jūsų erdvei.",
    body: "Individualiai gaminami stalviršiai ir apdaila iš natūralaus akmens — nuo matavimo iki montavimo.",
    primaryAction: { label: "Pradėti projektą", href: "/projektas" },
    secondaryAction: {
      label: "Peržiūrėti akmenį",
      href: "/akmuo",
    },
  },
  introduction: {
    title: "Pradėkite nuo gaminio arba akmens.",
    body: "Rinkitės pagal erdvę, paskirtį ir norimą raštą. Jei turite brėžinį, matmenis ar nuotraukas, sprendimą galime aptarti iš karto.",
  },
  professionals: {
    title: "Akmens gamyba pagal jūsų projektą.",
    body: "Su architektais, interjero dizaineriais, baldų gamintojais ir rangovais deriname medžiagą, matmenis, mazgus ir gamybos eigą.",
    action: { label: "Aptarti bendradarbiavimą", href: "/profesionalams" },
  },
  finalCallToAction: {
    title: "Aptarkime jūsų projektą.",
    body: "Atsiųskite brėžinį, matmenis, nuotraukas arba trumpai aprašykite, ko reikia. Nuo šios informacijos pradėsime konsultaciją.",
    action: { label: "Pradėti projektą", href: "/projektas" },
  },
} as const;

export const applicationGroups = [
  {
    id: "stalvirsiai-ir-vonia",
    title: "Stalviršiai ir vonia",
    description: "Stalviršiai ir praustuvo zonos, derinami prie baldų, įrangos bei jungčių.",
    applicationIds: ["virtuves-stalvirsiai", "vonios-stalvirsiai"],
  },
  {
    id: "interjero-apdaila",
    title: "Interjero apdaila",
    description: "Akmens apdaila sienoms, grindims ir židiniams pagal konkrečios erdvės matmenis.",
    applicationIds: ["zidiniu-apdaila", "sienu-apdaila", "grindu-danga"],
  },
  {
    id: "architekturos-detales",
    title: "Architektūros detalės",
    description: "Laiptai, palangės ir kolonos, gaminami pagal faktinę objekto geometriją.",
    applicationIds: ["laiptai-ir-laiptu-pakopos", "akmens-palanges", "kolonos"],
  },
  {
    id: "baldai-ir-objektai",
    title: "Baldai ir objektai",
    description: "Stalai ir akmens detalės vidaus bei lauko baldams pagal individualius brėžinius.",
    applicationIds: ["akmens-stalai", "vidaus-baldai", "lauko-baldai"],
  },
  {
    id: "eksterjeras-ir-atminimas",
    title: "Eksterjeras ir atminimas",
    description: "Fasadų detalės ir memorialiniai gaminiai, derinami prie konkrečios vietos.",
    applicationIds: ["fasadu-apdaila", "antkapiai-ir-paminklai"],
  },
] as const satisfies readonly ApplicationGroup[];

export const applications = [
  {
    id: "virtuves-stalvirsiai",
    slug: "virtuves-stalvirsiai",
    title: "Virtuvės stalviršiai, salos ir sienelės",
    shortTitle: "Virtuvės stalviršiai",
    description:
      "Stalviršiai, salos ir sienelės su išpjovomis plautuvei, kaitlentei bei maišytuvui.",
    planningNote:
      "Sprendžiame formą, matmenis, kraštus, jungtis ir akmens rašto kryptį.",
    group: "stalvirsiai-ir-vonia",
    featured: true,
    keywords: ["virtuvė", "stalviršis", "sala", "sienelė", "kaitlentė", "plautuvė"],
    href: "/gaminiai/virtuves-stalvirsiai",
    image: {
      src: "/assets/portfolio/granit-decor-darbai-dvidesimt.webp",
      alt: "Granit Decor įrengta virtuvė su tamsaus akmens sala ir sienele.",
    },
  },
  {
    id: "vonios-stalvirsiai",
    slug: "vonios-stalvirsiai",
    title: "Vonios stalviršiai ir akmens praustuvai",
    shortTitle: "Vonios stalviršiai",
    description:
      "Stalviršiai, akmens praustuvai, lentynos ir apdailos detalės vonios erdvei.",
    planningNote:
      "Deriname praustuvą, maišytuvus, išpjovas, kraštus ir kasdienę paviršiaus priežiūrą.",
    group: "stalvirsiai-ir-vonia",
    featured: true,
    keywords: ["vonia", "stalviršis", "plautuvė", "praustuvas", "vandens zona"],
    href: "/gaminiai/vonios-stalvirsiai",
    image: {
      src: "/assets/portfolio/granit-decor-darbai-trisdesimt.webp",
      alt: "Granit Decor įrengtas vonios baldas su akmens stalviršiu ir sienų apdaila.",
    },
  },
  {
    id: "zidiniu-apdaila",
    slug: "zidiniu-apdaila",
    title: "Židinių apdaila",
    shortTitle: "Židinių apdaila",
    description:
      "Natūralaus akmens apdaila vidaus, terasos ir pavėsinės židiniams.",
    planningNote:
      "Deriname židinio konstrukciją, plokščių išdėstymą, jungtis ir gretimas medžiagas.",
    group: "interjero-apdaila",
    featured: true,
    keywords: ["židinys", "židinio apdaila", "terasa", "pavėsinė", "siena"],
    href: "/gaminiai/zidiniu-apdaila",
    image: {
      src: "/assets/portfolio/granito-zidiniai-vienas.webp",
      alt: "Granit Decor pagaminta šviesaus akmens židinio apdaila.",
    },
  },
  {
    id: "sienu-apdaila",
    slug: "sienu-apdaila",
    title: "Sienų apdaila iš akmens",
    shortTitle: "Sienų apdaila",
    description:
      "Didelio formato plokštės sienoms ir akcentinėms interjero plokštumoms.",
    planningNote:
      "Numatome rašto kompoziciją, siūles, angas, tvirtinimą ir jungtis su kitomis medžiagomis.",
    group: "interjero-apdaila",
    featured: false,
    keywords: ["siena", "akcentinė siena", "plokštė", "apdaila", "interjeras"],
    href: "/gaminiai/sienu-apdaila",
    image: {
      src: "/assets/portfolio/granit-decor-darbai-dvidesimt-astuoni.webp",
      alt: "Granit Decor įrengta dekoratyvinė akmens sienos plokštė interjere.",
    },
  },
  {
    id: "grindu-danga",
    slug: "grindu-danga",
    title: "Akmens grindų danga",
    shortTitle: "Grindų danga",
    description:
      "Akmens detalės vidaus grindims ir kitiems vaikščiojamiems paviršiams.",
    planningNote:
      "Įvertiname pagrindą, apkrovą, formatą, siūlių kryptį, paviršių ir priežiūrą.",
    group: "interjero-apdaila",
    featured: false,
    keywords: ["grindys", "grindų danga", "plytelės", "vaikščiojamas paviršius"],
    href: "/gaminiai/grindu-danga",
    image: {
      src: "/assets/portfolio/granit-decor-darbai-keturiolika.webp",
      alt: "Atviro plano interjeras su akmens grindimis ir sienų apdaila.",
    },
  },
  {
    id: "laiptai-ir-laiptu-pakopos",
    slug: "laiptai-ir-laiptu-pakopos",
    title: "Laiptai ir laiptų pakopos",
    shortTitle: "Laiptai ir pakopos",
    description:
      "Vidaus ir lauko pakopos, polaipčiai bei aikštelės tiesiems, L ir U formos laiptams.",
    planningNote:
      "Matuojame faktinę geometriją ir deriname kraštus, pagrindus, turėklus bei montavimo sąlygas.",
    group: "architekturos-detales",
    featured: true,
    keywords: ["laiptai", "pakopos", "polaipčiai", "aikštelės", "lauko laiptai", "L forma", "U forma"],
    href: "/gaminiai/laiptai-ir-laiptu-pakopos",
    image: {
      src: "/assets/portfolio/granito-laiptai-vienas.webp",
      alt: "Granit Decor pagamintos tamsaus granito laiptų pakopos.",
    },
  },
  {
    id: "akmens-palanges",
    slug: "akmens-palanges",
    title: "Akmens palangės",
    shortTitle: "Akmens palangės",
    description:
      "Vidaus ir lauko palangės pagal faktinius langų angų matmenis.",
    planningNote:
      "Tiksliname gylį, iškyšą, kraštą ir jungtis su langu bei sienos apdaila.",
    group: "architekturos-detales",
    featured: false,
    keywords: ["palangė", "akmens palangė", "lango anga", "vidaus palangė", "lauko palangė"],
    href: "/gaminiai/akmens-palanges",
    image: {
      src: "/assets/portfolio/granito-palanges-vienas.webp",
      alt: "Granit Decor pagaminta šviesaus akmens vidaus palangė.",
    },
  },
  {
    id: "kolonos",
    slug: "kolonos",
    title: "Vidaus ir lauko kolonos",
    shortTitle: "Kolonos",
    description:
      "Akmens elementai ir apdaila vidaus bei lauko kolonoms.",
    planningNote:
      "Deriname kolonos geometriją, segmentus, rašto kryptį, pagrindą ir tvirtinimą.",
    group: "architekturos-detales",
    featured: false,
    keywords: ["kolona", "kolonos", "kolonų apdaila", "architektūra", "laukas"],
    href: "/gaminiai/kolonos",
    image: {
      src: "/assets/portfolio/granito-kolonos-vienas.webp",
      alt: "Granit Decor pagamintos masyvaus granito lauko kolonos.",
    },
  },
  {
    id: "akmens-stalai",
    slug: "akmens-stalai",
    title: "Akmens stalai",
    shortTitle: "Akmens stalai",
    description:
      "Valgomojo, kavos, konsoliniai ir individualios paskirties akmens stalai.",
    planningNote:
      "Deriname formą, matomą storį, rašto kryptį, pagrindą ir atramų vietas.",
    group: "baldai-ir-objektai",
    featured: false,
    keywords: ["stalas", "akmens stalas", "valgomojo stalas", "kavos staliukas", "stalviršis"],
    href: "/gaminiai/akmens-stalai",
    image: {
      src: "/assets/portfolio/granito-stalas-vienas.webp",
      alt: "Individualiai pagamintas lenktos formos granito baldo stalviršis.",
    },
  },
  {
    id: "vidaus-baldai",
    slug: "vidaus-baldai",
    title: "Akmens detalės vidaus baldams",
    shortTitle: "Vidaus baldai",
    description:
      "Stalviršiai, lentynos, konsolės ir kitos akmens detalės vidaus baldams.",
    planningNote:
      "Pagal baldo brėžinį deriname matmenis, atramas, tvirtinimą ir iškyšas.",
    group: "baldai-ir-objektai",
    featured: true,
    keywords: ["vidaus baldai", "konsolė", "lentyna", "svetainė", "vonios baldas", "virtuvės baldas"],
    href: "/gaminiai/vidaus-baldai",
    image: {
      src: "/assets/portfolio/granito-pirties-baldai.webp",
      alt: "Granit Decor pagaminti granito baldai pirties erdvei.",
    },
  },
  {
    id: "lauko-baldai",
    slug: "lauko-baldai",
    title: "Akmens detalės lauko baldams",
    shortTitle: "Lauko baldai",
    description:
      "Stalai, suolai, stalviršiai ir individualios akmens detalės lauko baldams.",
    planningNote:
      "Įvertiname konstrukciją, vandens nubėgimą, paviršių ir konkrečias lauko sąlygas.",
    group: "baldai-ir-objektai",
    featured: false,
    keywords: ["lauko baldai", "sodo baldai", "kiemo baldai", "suolas", "lauko stalas"],
    href: "/gaminiai/lauko-baldai",
    image: {
      src: "/assets/portfolio/granito-suolas-vienas.webp",
      alt: "Granit Decor pagamintas vientisos formos granito lauko suolas.",
    },
  },
  {
    id: "fasadu-apdaila",
    slug: "fasadu-apdaila",
    title: "Fasadų apdaila",
    shortTitle: "Fasadų apdaila",
    description:
      "Akmens plokštės ir detalės fasadams, cokoliams bei angokraščiams.",
    planningNote:
      "Pagal projektą deriname medžiagą, formatą, pagrindą, tvirtinimo mazgus ir aplinkos sąlygas.",
    group: "eksterjeras-ir-atminimas",
    featured: true,
    keywords: ["fasadas", "fasadų apdaila", "pastato išorė", "lauko apdaila"],
    href: "/gaminiai/fasadu-apdaila",
    image: {
      src: "/assets/portfolio/granito-lauko-apdaila-vienas.webp",
      alt: "Granit Decor įrengta granito lauko apdaila prie įėjimo.",
    },
  },
  {
    id: "antkapiai-ir-paminklai",
    slug: "antkapiai-ir-paminklai",
    title: "Antkapiai ir paminklai",
    shortTitle: "Antkapiai ir paminklai",
    description:
      "Antkapiai, paminklai, akmens sienelės, apvadai ir kapo uždengimo plokštės.",
    planningNote:
      "Deriname kapavietės matmenis, kompoziciją, akmenį, užrašą ir montavimą.",
    group: "eksterjeras-ir-atminimas",
    featured: false,
    keywords: ["antkapis", "paminklas", "memorialas", "tvorelė", "akmens sienelė", "kapo plokštė"],
    href: "/gaminiai/antkapiai-ir-paminklai",
    image: {
      src: "/assets/portfolio/paminklai-ir-antkapiai-vienas.webp",
      alt: "Granit Decor pagamintas individualus granito memorialas.",
    },
  },
] as const satisfies readonly ApplicationRecord[];

export const processSteps = [
  {
    id: "aptarimas",
    title: "Aptariame projektą",
    description:
      "Peržiūrime jūsų brėžinį, matmenis ar nuotraukas ir tiksliai įvardijame, kokio gaminio reikia.",
  },
  {
    id: "akmens-parinkimas",
    title: "Parenkame akmenį",
    description:
      "Pagal gaminio vietą ir naudojimą atrenkame tinkamą akmens tipą, atspalvį bei raštą.",
  },
  {
    id: "matavimas-ir-projektavimas",
    title: "Matuojame ir projektuojame",
    description:
      "Patiksliname matmenis, išpjovas, kraštus ir jungtis, tada suderiname gamybos brėžinius.",
  },
  {
    id: "gamyba",
    title: "Gaminame",
    description:
      "Gaminame pagal suderintus matmenis, detales ir pasirinktos plokštės raštą.",
  },
  {
    id: "pristatymas-ir-montavimas",
    title: "Pristatome ir montuojame",
    description:
      "Pristatome ir sumontuojame pagamintas detales, paaiškiname paviršiaus priežiūrą.",
  },
] as const satisfies readonly ProcessStep[];

/**
 * These records represent public portfolio images only. Project facts remain null
 * until Granit Decor approves names, locations, materials, dates and collaborators.
 */
export const projects = [
  {
    id: "granit-decor-darbai-25",
    slug: "granit-decor-darbai-25",
    title: null,
    displayLabel: "Lenktos virtuvės salos",
    detailsStatus: "unverified",
    categories: ["virtuve"],
    image: {
      src: "/assets/portfolio/granit-decor-darbai-dvidesimt-penki.webp",
      alt: "Lenktos formos akmens sala interjere su mėlyna akcentine siena.",
    },
    imageOrientation: "portrait",
    sourceAssetId: "granit-decor-darbai_25",
    featured: true,
    stone: null,
    location: null,
    completedAt: null,
    collaborators: null,
  },
  {
    id: "granit-decor-darbai-30",
    slug: "granit-decor-darbai-30",
    title: null,
    displayLabel: "Šviesios vonios erdvės",
    detailsStatus: "unverified",
    categories: ["vonios-erdve"],
    image: {
      src: "/assets/portfolio/granit-decor-darbai-trisdesimt.webp",
      alt: "Šviesi vonios erdvė su marmuro rašto akmens apdaila.",
    },
    imageOrientation: "portrait",
    sourceAssetId: "granit-decor-darbai_30",
    featured: true,
    stone: null,
    location: null,
    completedAt: null,
    collaborators: null,
  },
  {
    id: "granit-decor-darbai-03",
    slug: "granit-decor-darbai-03",
    title: null,
    displayLabel: "Atviro plano virtuvės",
    detailsStatus: "unverified",
    categories: ["virtuve"],
    image: {
      src: "/assets/portfolio/granit-decor-darbai-trys.webp",
      alt: "Šilta atviro plano virtuvė su akmens stalviršiu ir sala.",
    },
    imageOrientation: "portrait",
    sourceAssetId: "granit-decor-darbai_03",
    featured: true,
    stone: null,
    location: null,
    completedAt: null,
    collaborators: null,
  },
  {
    id: "granit-decor-darbai-05",
    slug: "granit-decor-darbai-05",
    title: null,
    displayLabel: "Virtuvės ir valgomojo erdvės",
    detailsStatus: "unverified",
    categories: ["virtuve"],
    image: {
      src: "/assets/portfolio/granit-decor-darbai-penki.webp",
      alt: "Plati virtuvės ir valgomojo erdvė su šviesiu stalviršiu.",
    },
    imageOrientation: "landscape",
    sourceAssetId: "granit-decor-darbai_05",
    featured: false,
    stone: null,
    location: null,
    completedAt: null,
    collaborators: null,
  },
  {
    id: "granit-decor-darbai-13",
    slug: "granit-decor-darbai-13",
    title: null,
    displayLabel: "Virtuvės akmens detalės",
    detailsStatus: "unverified",
    categories: ["virtuve"],
    image: {
      src: "/assets/portfolio/granit-decor-darbai-trylika.webp",
      alt: "Tamsaus akmens virtuvės stalviršio detalė.",
    },
    imageOrientation: "portrait",
    sourceAssetId: "granit-decor-darbai_13",
    featured: false,
    stone: null,
    location: null,
    completedAt: null,
    collaborators: null,
  },
  {
    id: "granit-decor-darbai-16",
    slug: "granit-decor-darbai-16",
    title: null,
    displayLabel: "Tamsaus akmens virtuvės",
    detailsStatus: "unverified",
    categories: ["virtuve"],
    image: {
      src: "/assets/portfolio/granit-decor-darbai-sesiolika.webp",
      alt: "Šviesi virtuvė su tamsia sala.",
    },
    imageOrientation: "landscape",
    sourceAssetId: "granit-decor-darbai_16",
    featured: false,
    stone: null,
    location: null,
    completedAt: null,
    collaborators: null,
  },
  {
    id: "granit-decor-darbai-29",
    slug: "granit-decor-darbai-29",
    title: null,
    displayLabel: "Tamsaus akmens vonios",
    detailsStatus: "unverified",
    categories: ["vonios-erdve"],
    image: {
      src: "/assets/portfolio/granit-decor-darbai-dvidesimt-devyni.webp",
      alt: "Vonios erdvė su tamsaus akmens paviršiais.",
    },
    imageOrientation: "landscape",
    sourceAssetId: "granit-decor-darbai_29",
    featured: false,
    stone: null,
    location: null,
    completedAt: null,
    collaborators: null,
  },
  {
    id: "granit-decor-darbai-24",
    slug: "granit-decor-darbai-24",
    title: null,
    displayLabel: "Akmens sienų akcentai",
    detailsStatus: "unverified",
    categories: ["interjero-elementas"],
    image: {
      src: "/assets/portfolio/granit-decor-darbai-dvidesimt-keturi.webp",
      alt: "Virtuvės erdvė su mėlyno akmens sienų apdaila ir lenktos formos sala.",
    },
    imageOrientation: "landscape",
    sourceAssetId: "granit-decor-darbai_24",
    featured: false,
    stone: null,
    location: null,
    completedAt: null,
    collaborators: null,
  },
  {
    id: "granit-decor-darbai-31",
    slug: "granit-decor-darbai-31",
    title: null,
    displayLabel: "Vonios stalviršiai ir detalės",
    detailsStatus: "unverified",
    categories: ["vonios-erdve"],
    image: {
      src: "/assets/portfolio/granit-decor-darbai-trisdesimt-vienas.webp",
      alt: "Vonios baldo ir akmens paviršiaus detalė.",
    },
    imageOrientation: "landscape",
    sourceAssetId: "granit-decor-darbai_31",
    featured: false,
    stone: null,
    location: null,
    completedAt: null,
    collaborators: null,
  },
] as const satisfies readonly ProjectRecord[];

export const materialCategories = [
  {
    id: "granitas",
    slug: "granitas",
    name: "Granitas",
    description:
      "Granitas gali būti tolygus ir smulkiagrūdis arba ryškiai kontrastingas. Plokštę rinkitės pagal gaminio mastelį, ne vien atspalvį.",
    visualCharacter: "Mineralinis raštas — nuo tolygaus iki kontrastingo.",
    href: "/akmuo?tipas=granitas",
  },
  {
    id: "marmuras",
    slug: "marmuras",
    name: "Marmuras",
    description:
      "Marmuro gyslos kiekvienoje plokštėje skiriasi. Vertinkite visą plokštę ir numatykite, kur raštas tęsis gaminyje.",
    visualCharacter: "Gyslotas raštas — nuo ramaus iki grafiško.",
    href: "/akmuo?tipas=marmuras",
  },
  {
    id: "kvarcitas",
    slug: "kvarcitas",
    name: "Kvarcitas",
    description:
      "Kvarcito sluoksniai ir kryptingas raštas geriausiai matomi visoje plokštėje. Mažas pavyzdys neparodo visos kompozicijos.",
    visualCharacter: "Sluoksniuotas, kryptingas, gilus raštas.",
    href: "/akmuo?tipas=kvarcitas",
  },
  {
    id: "oniksas",
    slug: "oniksas",
    name: "Oniksas",
    description:
      "Oniksas išsiskiria sluoksniais ir spalvų perėjimais. Kai kurioms plokštėms galima numatyti apšvietimą, tačiau sprendimas vertinamas individualiai.",
    visualCharacter: "Sluoksniuotas, spalvingas, iš dalies praleidžiantis šviesą.",
    href: "/akmuo?tipas=oniksas",
  },
  {
    id: "travertinas",
    slug: "travertinas",
    name: "Travertinas",
    description:
      "Travertiną atpažinsite iš linijinio sluoksnių rašto ir natūralių porų. Jo vaizdą keičia pjovimo kryptis bei paviršiaus apdaila.",
    visualCharacter: "Linijinis, porėtas, šiltų žemės tonų.",
    href: "/akmuo?tipas=travertinas",
  },
] as const satisfies readonly MaterialCategory[];

export const professionalCollaboration = [
  {
    id: "medziagos-parinkimas",
    title: "Medžiagos parinkimas",
    description:
      "Pagal naudojimo vietą, spalvinę kryptį ir rašto mastelį atrenkame svarstytinas plokštes.",
  },
  {
    id: "sprendiniu-derinimas",
    title: "Matmenų ir sprendinių derinimas",
    description:
      "Suderiname matmenis, išpjovas, kraštus, jungtis ir sąlytį su kitomis projekto dalimis.",
  },
  {
    id: "gamybos-koordinavimas",
    title: "Gamybos koordinavimas",
    description:
      "Prieš gamybą patikriname brėžinius, medžiagą ir visas akmens detalę veikiančias sąlygas.",
  },
  {
    id: "montavimo-koordinavimas",
    title: "Pristatymas ir montavimas",
    description:
      "Pristatymo ir montavimo laiką deriname su objekto parengtimi bei kitais darbais.",
  },
] as const satisfies readonly ProfessionalCollaborationItem[];

const unconfirmedContactField = (label: string): ContactField => ({
  value: null,
  label,
  status: "requires-client-confirmation",
});

export const siteMetadata: SiteMetadata = {
  name: "Granit Decor",
  locale: "lt-LT",
  title: "Granit Decor | Natūralaus akmens gaminiai",
  description:
    "Individualūs granito, marmuro, kvarcito, onikso ir travertino gaminiai — nuo medžiagos parinkimo ir matavimo iki montavimo.",
  productionUrl: "https://www.granitdecor.lt",
  serviceAreaLabel: "Lietuva",
  contact: {
    phone: unconfirmedContactField("Telefono numerį patvirtinti su klientu"),
    email: unconfirmedContactField("El. pašto adresą patvirtinti su klientu"),
    address: unconfirmedContactField("Lankymo adresą patvirtinti su klientu"),
    openingHours: unconfirmedContactField("Darbo laiką patvirtinti su klientu"),
    mapUrl: unconfirmedContactField("Žemėlapio nuorodą patvirtinti su klientu"),
    legalName: unconfirmedContactField("Juridinį pavadinimą patvirtinti su klientu"),
    companyCode: unconfirmedContactField("Įmonės kodą patvirtinti su klientu"),
  },
};
