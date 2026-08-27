import type { ClientBrandConfig } from "@/template/client-config";

export const granitDecorBrandConfig = {
  siteId: "granit-decor",
  identity: {
    name: "Granit Decor",
    wordmark: "GRANIT DECOR",
    legalCopyrightName: "Granit Decor, UAB",
    homeAriaLabel: "Granit Decor — pradinis puslapis",
  },
  brand: {
    logo: {
      src: "/assets/brand/granit-decor-logo.png",
      width: 300,
      height: 326,
      sizes: "64px",
    },
    accent: "#7b3025",
    background: "#f5f2eb",
  },
  ui: {
    skipToContent: "Pereiti prie turinio",
    backToTop: "Į viršų ↑",
    playMotion: "Paleisti animaciją",
    pauseMotion: "Sustabdyti animaciją",
  },
} as const satisfies ClientBrandConfig;
