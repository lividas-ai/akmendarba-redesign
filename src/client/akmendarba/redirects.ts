export type ClientRedirect = {
  source: string;
  destination: string;
};

/** The destination preserves all fourteen public source paths exactly. */
export const akmendarbaRedirects: readonly ClientRedirect[] = [];
