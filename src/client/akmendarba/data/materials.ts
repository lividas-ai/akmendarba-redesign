/**
 * Preserve the locked explorer's category contract even though this client has
 * no published material catalogue. No category or material is rendered unless
 * it is present in the empty, source-backed arrays exported below.
 */
export type MaterialCategory =
  | "marmuras"
  | "granitas"
  | "oniksas"
  | "travertinas"
  | "kvarcitas";

export interface Material {
  slug: string;
  name: string;
  category: MaterialCategory;
  sourceUrl: string;
  optimizedUrl: string;
  localPath: string;
  featured: boolean;
  needsConfirmation: boolean;
  notes?: string;
}

/**
 * The public Akmendarba site does not publish a named stone catalogue or a
 * selectable material inventory. Keep the stable export empty so the locked
 * shell can compile without inventing products.
 */
export const materials: readonly Material[] = [];
