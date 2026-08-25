import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Granit Decor",
    short_name: "Granit Decor",
    description: "Individualūs natūralaus akmens gaminiai, projektavimas ir montavimas.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f2eb",
    theme_color: "#7b3025",
    lang: "lt",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
