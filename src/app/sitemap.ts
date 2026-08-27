import type { MetadataRoute } from "next";
import { activeSiteConfig } from "@/client";
import { activeSiteManifest } from "@/client/manifest";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredRoutes = new Map(
    activeSiteConfig.sitemap.map((route) => [route.path || "/", route]),
  );

  return activeSiteManifest.pages
    .filter((page) => page.publication === "published" && !page.seo?.noIndex)
    .map((page) => {
      const configured = configuredRoutes.get(page.path);
      return {
        url: `${activeSiteConfig.seo.canonicalUrl}${page.path}`,
        changeFrequency: configured?.changeFrequency ?? (page.kind === "detail" ? "yearly" : "monthly"),
        priority: configured?.priority ?? (page.kind === "detail" ? 0.55 : 0.65),
      };
    });
}
