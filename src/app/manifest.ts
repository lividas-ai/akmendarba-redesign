import type { MetadataRoute } from "next";
import { activeSiteConfig } from "@/client";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: activeSiteConfig.identity.name,
    short_name: activeSiteConfig.pwa.shortName,
    description: activeSiteConfig.pwa.description,
    start_url: "/",
    display: "standalone",
    background_color: activeSiteConfig.brand.background,
    theme_color: activeSiteConfig.brand.accent,
    lang: activeSiteConfig.htmlLang,
    icons: [activeSiteConfig.pwa.icon],
  };
}
