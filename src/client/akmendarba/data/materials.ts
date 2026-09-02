export type MaterialCategory = "granitas" | "marmuras";

export interface Material {
  slug: string;
  name: string;
  category: MaterialCategory;
  sourceUrl: string;
  optimizedUrl: string;
  localPath: string;
  featured: boolean;
  needsConfirmation: boolean;
  sourceContext: string;
  notes?: string;
}

/**
 * Akmendarba publicly presents granite and marble, but does not publish a
 * named slab catalogue. These two records are therefore selection directions,
 * not stock items: their names and images come directly from the source site,
 * while availability and the exact slab remain intentionally unclaimed.
 */
export const materials: readonly Material[] = [
  {
    slug: "granitas",
    name: "Granitas",
    category: "granitas",
    sourceUrl: "https://akmendarba.lt/wp-content/uploads/2018/05/Granite-1.jpg",
    optimizedUrl: "/client/akmendarba/source/Granite-1.jpg",
    localPath: "/client/akmendarba/source/Granite-1.jpg",
    featured: true,
    needsConfirmation: true,
    sourceContext: "Šaltinio nuotraukoje rodoma akmens plokščių ekspozicija.",
    notes: "Konkrečius granito variantus ir jų prieinamumą reikia patvirtinti su Akmendarba.",
  },
  {
    slug: "marmuras",
    name: "Marmuras",
    category: "marmuras",
    sourceUrl: "https://akmendarba.lt/wp-content/uploads/2018/05/cava_bianco_carrara_2.jpg",
    optimizedUrl: "/client/akmendarba/source/cava_bianco_carrara_2.jpg",
    localPath: "/client/akmendarba/source/cava_bianco_carrara_2.jpg",
    featured: true,
    needsConfirmation: true,
    sourceContext: "Šaltinio nuotraukoje rodoma marmuro gavybos vieta.",
    notes: "Konkrečius marmuro variantus ir jų prieinamumą reikia patvirtinti su Akmendarba.",
  },
];
