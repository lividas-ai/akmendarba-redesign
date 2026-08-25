/**
 * Public Granit Decor work archive mirrored from:
 * https://www.granitdecor.lt/akmens-gaminiai
 *
 * The source page contains 118 unique images in nine editorial sections.
 * Source filenames remain in `sourceUrl` for provenance, while public slugs and
 * local asset paths spell out ordinal identifiers so no numeric labels leak
 * into the visitor-facing experience.
 */

export const portfolioCategories = [
  {
    slug: "akmens-gaminiai",
    label: "Akmens gaminiai",
    description: "Granit Decor atlikti natūralaus akmens darbai.",
  },
  {
    slug: "virtuves-stalvirsiai",
    label: "Virtuvės stalviršiai",
    description: "Virtuvės stalviršiai iš marmuro, granito, onikso ir kito natūralaus akmens.",
  },
  {
    slug: "vonios-stalvirsiai",
    label: "Vonios stalviršiai",
    description: "Vonios stalviršiai iš marmuro, granito, travertino ir kito natūralaus akmens.",
  },
  {
    slug: "lauko-baldai-kolonos",
    label: "Lauko baldai, kolonos",
    description: "Lauko baldai ir kolonos iš marmuro, granito bei kito natūralaus akmens.",
  },
  {
    slug: "palanges",
    label: "Palangės",
    description: "Palangės iš marmuro, granito ir kito natūralaus akmens.",
  },
  {
    slug: "laiptai-ir-laiptu-pakopos",
    label: "Laiptai ir laiptų pakopos",
    description: "Laiptai ir laiptų pakopos iš marmuro, granito ir kito natūralaus akmens.",
  },
  {
    slug: "paminklai-antkapiai",
    label: "Paminklai, antkapiai",
    description: "Paminklai ir antkapiai iš marmuro, granito ir kito natūralaus akmens.",
  },
  {
    slug: "stalai",
    label: "Stalai",
    description: "Stalai iš marmuro, granito, kvarcito ir kito natūralaus akmens.",
  },
  {
    slug: "zidiniai",
    label: "Židiniai",
    description: "Židiniai iš marmuro, granito ir kito natūralaus akmens.",
  },
] as const;

export type PortfolioCategorySlug = (typeof portfolioCategories)[number]["slug"];

export type PortfolioItem = {
  slug: string;
  /** Original public archive filename without its extension; kept only for provenance and stable internal lookup. */
  sourceAssetId: string;
  category: PortfolioCategorySlug;
  categoryLabel: string;
  alt: string;
  caption: string;
  localPath: string;
  sourceUrl: string;
};

type SourceFile = string | { file: string; alt: string };

type SourceGroup = {
  category: PortfolioCategorySlug;
  alt: string;
  caption: string;
  files: readonly SourceFile[];
};

const sourceBaseUrl = "https://irp.cdn-website.com/b8e91eb1/dms3rep/multi";

const sourceGroups: readonly SourceGroup[] = [
  {
    category: "akmens-gaminiai",
    alt: "Granit Decor natūralaus akmens gaminiai: virtuvės stalviršis, stalas ir sienų apdaila",
    caption: "Natūralaus akmens darbų pavyzdys.",
    files: [
      "granit-decor-darbai_07.jpg",
      "granit-decor-darbai_09.jpg",
      "granit-decor-darbai_06.jpg",
      "granit-decor-darbai_01.jpg",
      "granit-decor-darbai_03.jpg",
      "granit-decor-darbai_05.jpg",
      "granit-decor-darbai_02.jpg",
      "granit-decor-darbai_08.jpg",
      "granit-decor-darbai_04.jpg",
      "granit-decor-darbai_20.jpg",
      "granit-decor-darbai_12.jpg",
      "granit-decor-darbai_10.jpg",
      "granit-decor-darbai_14.jpg",
      "granit-decor-darbai_15.jpg",
      "granit-decor-darbai_13.jpg",
      "granit-decor-darbai_16.jpg",
      "granit-decor-darbai_19.jpg",
      "granit-decor-darbai_17.jpg",
      "granit-decor-darbai_18.jpg",
      "granit-decor-darbai_21.jpg",
      { file: "granit-decor-darbai_29.jpg", alt: "Granit Decor natūralaus akmens vonios sienų apdaila" },
      { file: "granit-decor-darbai_24.jpg", alt: "Granit Decor natūralaus akmens virtuvės stalviršis" },
      "granit-decor-darbai_27.jpg",
      { file: "granit-decor-darbai_33.jpg", alt: "Granit Decor natūralaus akmens vonios sienų apdaila" },
      {
        file: "granit-decor-darbai_30.jpg",
        alt: "Granit Decor natūralaus akmens vonios stalviršis ir sienų apdaila",
      },
      { file: "granit-decor-darbai_25.jpg", alt: "Granit Decor natūralaus akmens virtuvės stalviršis" },
      "granit-decor-darbai_26.jpg",
      {
        file: "granit-decor-darbai_31.jpg",
        alt: "Granit Decor natūralaus akmens vonios stalviršis ir sienų apdaila",
      },
      { file: "granit-decor-darbai_28.jpg", alt: "Granit Decor natūralaus akmens sienų apdaila" },
      "granit-decor-darbai_34.jpg",
    ],
  },
  {
    category: "virtuves-stalvirsiai",
    alt: "Granit Decor virtuvės stalviršio darbų pavyzdys",
    caption: "Virtuvės stalviršio darbų pavyzdys.",
    files: [
      "virtuves-baldai-stalvirsiai-49.jpg",
      "virtuves-baldai-stalvirsiai-34.jpg",
      "virtuves-baldai-stalvirsiai-47.jpg",
      "virtuves-baldai-stalvirsiai-11.jpg",
      "virtuves-baldai-stalvirsiai-09.jpg",
      "virtuves-baldai-stalvirsiai-28.jpg",
      "virtuves-baldai-stalvirsiai-40.jpg",
      "virtuves-baldai-stalvirsiai-02.jpg",
      "virtuves-baldai-stalvirsiai-05.jpg",
      "virtuves-baldai-stalvirsiai-51.jpg",
      "virtuves-baldai-stalvirsiai-53.jpg",
      "virtuves-baldai-stalvirsiai-52.jpg",
      "virtuves-baldai-stalvirsiai-50.jpg",
      "virtuves-baldai-stalvirsiai-48.jpg",
      "virtuves-baldai-stalvirsiai-46.jpg",
      "virtuves-baldai-stalvirsiai-45.jpg",
      "virtuves-baldai-stalvirsiai-43.jpg",
      "virtuves-baldai-stalvirsiai-41.jpg",
      "virtuves-baldai-stalvirsiai-39.jpg",
      "virtuves-baldai-stalvirsiai-42.jpg",
      "virtuves-baldai-stalvirsiai-38.jpg",
      "virtuves-baldai-stalvirsiai-36.jpg",
      "virtuves-baldai-stalvirsiai-37.jpg",
      "virtuves-baldai-stalvirsiai-35.jpg",
      "virtuves-baldai-stalvirsiai-33.jpg",
      "virtuves-baldai-stalvirsiai-31.jpg",
      "virtuves-baldai-stalvirsiai-32.jpg",
      "virtuves-baldai-stalvirsiai-30.jpg",
      "virtuves-baldai-stalvirsiai-25.jpg",
      "virtuves-baldai-stalvirsiai-29.jpg",
      "virtuves-baldai-stalvirsiai-27.jpg",
      "virtuves-baldai-stalvirsiai-26.jpg",
      "virtuves-baldai-stalvirsiai-24.jpg",
      "virtuves-baldai-stalvirsiai-20.jpg",
      "virtuves-baldai-stalvirsiai-23.jpg",
      "virtuves-baldai-stalvirsiai-22.jpg",
      "virtuves-baldai-stalvirsiai-21.jpg",
      "virtuves-baldai-stalvirsiai-19.jpg",
      "virtuves-baldai-stalvirsiai-18.jpg",
      "virtuves-baldai-stalvirsiai-17.jpg",
      "virtuves-baldai-stalvirsiai-14.jpg",
      "virtuves-baldai-stalvirsiai-16.jpg",
      "virtuves-baldai-stalvirsiai-13.jpg",
      "virtuves-baldai-stalvirsiai-12.jpg",
      "virtuves-baldai-stalvirsiai-15.jpg",
      "virtuves-baldai-stalvirsiai-10.jpg",
      "virtuves-baldai-stalvirsiai-08.jpg",
      "virtuves-baldai-stalvirsiai-07.jpg",
      "virtuves-baldai-stalvirsiai-06.jpg",
      "virtuves-baldai-stalvirsiai-03.jpg",
      "virtuves-baldai-stalvirsiai-04.jpg",
      "virtuves-baldai-stalvirsiai-01.jpg",
    ],
  },
  {
    category: "vonios-stalvirsiai",
    alt: "Granit Decor vonios stalviršio darbų pavyzdys",
    caption: "Vonios stalviršio darbų pavyzdys.",
    files: [
      "vonios-baldai-stalvirsiai-05.jpg",
      "vonios-baldai-stalvirsiai-06.jpg",
      "vonios-baldai-stalvirsiai-12.jpg",
      "vonios-baldai-stalvirsiai-07.jpg",
      "vonios-baldai-stalvirsiai-01.jpg",
      "vonios-baldai-stalvirsiai-09.jpg",
      "vonios-baldai-stalvirsiai-08.jpg",
      "vonios-baldai-stalvirsiai-13.jpg",
      "vonios-baldai-stalvirsiai-10.jpg",
      "vonios-baldai-stalvirsiai-03.jpg",
      "vonios-baldai-stalvirsiai-02.jpg",
      "vonios-baldai-stalvirsiai-04.jpg",
      "vonios-baldai-stalvirsiai-11.jpg",
    ],
  },
  {
    category: "lauko-baldai-kolonos",
    alt: "Granit Decor lauko akmens gaminių darbų pavyzdys",
    caption: "Lauko baldų ir kolonų darbų pavyzdys.",
    files: [
      { file: "granito-suolas-01.jpg", alt: "Granit Decor natūralaus akmens lauko suoliukas" },
      { file: "granito-lauko-apdaila-01.jpg", alt: "Granit Decor natūralaus akmens lauko baldai" },
      { file: "granito-kolonos-02.jpg", alt: "Granit Decor natūralaus akmens lauko kolonos" },
      { file: "granito-pirties-baldai.jpg", alt: "Granit Decor natūralaus akmens pirties baldai" },
      { file: "granito-kolonos-01.jpg", alt: "Granit Decor natūralaus akmens lauko kolonos" },
    ],
  },
  {
    category: "palanges",
    alt: "Granit Decor natūralaus akmens palangės darbų pavyzdys",
    caption: "Akmens palangės darbų pavyzdys.",
    files: [
      "granito-palanges-04.jpg",
      "granito-palanges-02.jpg",
      "granito-palanges-03.jpg",
      "granito-palanges-01.jpg",
      "granito-palanges-05.jpg",
    ],
  },
  {
    category: "laiptai-ir-laiptu-pakopos",
    alt: "Granit Decor natūralaus akmens laiptų darbų pavyzdys",
    caption: "Akmens laiptų ir pakopų darbų pavyzdys.",
    files: ["granito-laiptai-02.jpg", "granito-laiptai-01.jpg", "granito-laiptai-03.jpg"],
  },
  {
    category: "paminklai-antkapiai",
    alt: "Granit Decor natūralaus akmens paminklo ir antkapio darbų pavyzdys",
    caption: "Akmens paminklo ir antkapio darbų pavyzdys.",
    files: ["paminklai-ir-antkapiai-02.jpg", "paminklai-ir-antkapiai-01.jpg", "paminklai-ir-antkapiai-03.jpg"],
  },
  {
    category: "stalai",
    alt: "Granit Decor natūralaus akmens stalo darbų pavyzdys",
    caption: "Akmens stalo darbų pavyzdys.",
    files: ["granito-stalas-01.jpg", "granito-stalas-02.jpg", "granito-stalas-03.jpg"],
  },
  {
    category: "zidiniai",
    alt: "Granit Decor natūralaus akmens židinio apdailos darbų pavyzdys",
    caption: "Akmens židinio apdailos darbų pavyzdys.",
    files: [
      "granito-zidiniai-01.jpg",
      "granito-zidiniai-02.jpg",
      "granito-zidiniai-03.jpg",
      "granito-zidiniai-04.jpg",
    ],
  },
];

const ones = ["nulis", "vienas", "du", "trys", "keturi", "penki", "sesi", "septyni", "astuoni", "devyni"] as const;
const teens = [
  "desimt",
  "vienuolika",
  "dvylika",
  "trylika",
  "keturiolika",
  "penkiolika",
  "sesiolika",
  "septyniolika",
  "astuoniolika",
  "devyniolika",
] as const;
const tens = [
  "",
  "",
  "dvidesimt",
  "trisdesimt",
  "keturiasdesimt",
  "penkiasdesimt",
  "sesiasdesimt",
  "septyniasdesimt",
  "astuoniasdesimt",
  "devyniasdesimt",
] as const;

function numberAsSlug(value: number) {
  if (value < 10) return ones[value];
  if (value < 20) return teens[value - 10];

  const unit = value % 10;
  const ten = tens[Math.floor(value / 10)];
  return unit === 0 ? ten : `${ten}-${ones[unit]}`;
}

function sourceFileToSlug(file: string) {
  return file
    .replace(/\.jpe?g$/i, "")
    .replace(/\d+/g, (value) => numberAsSlug(Number(value)))
    .replace(/_/g, "-")
    .toLowerCase();
}

const categoryBySlug = new Map(portfolioCategories.map((category) => [category.slug, category]));

export const portfolioItems: readonly PortfolioItem[] = sourceGroups.flatMap((group) => {
  const category = categoryBySlug.get(group.category);
  if (!category) throw new Error(`Unknown portfolio category: ${group.category}`);

  return group.files.map((entry) => {
    const file = typeof entry === "string" ? entry : entry.file;
    const slug = sourceFileToSlug(file);

    return {
      slug,
      sourceAssetId: file.replace(/\.jpe?g$/i, ""),
      category: group.category,
      categoryLabel: category.label,
      alt: typeof entry === "string" ? group.alt : entry.alt,
      caption: group.caption,
      localPath: `/assets/portfolio/${slug}.webp`,
      sourceUrl: `${sourceBaseUrl}/${file}`,
    };
  });
});

if (portfolioItems.length !== 118 || new Set(portfolioItems.map((item) => item.slug)).size !== 118) {
  throw new Error("The Granit Decor portfolio archive must contain 118 unique public images.");
}

export function getPortfolioItems(category: PortfolioCategorySlug | "visi") {
  return category === "visi" ? portfolioItems : portfolioItems.filter((item) => item.category === category);
}
