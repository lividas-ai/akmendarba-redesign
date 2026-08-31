import type { ClientBrandConfig } from "@/template/client-config";

export const akmendarbaBrandConfig = {
  siteId: "akmendarba",
  identity: {
    name: "Akmendarba",
    wordmark: "",
    legalCopyrightName: "Akmendarba, UAB",
    homeAriaLabel: "Akmendarba — pradinis puslapis",
  },
  brand: {
    logo: {
      src: "/client/akmendarba/source/logo.png",
      width: 600,
      height: 120,
      sizes: "(max-width: 767px) 150px, 220px",
    },
    accent: "#65574b",
    background: "#f3f1ed",
  },
  ui: {
    skipToContent: "Pereiti prie turinio",
    backToTop: "Į viršų ↑",
    playMotion: "Paleisti animaciją",
    pauseMotion: "Sustabdyti animaciją",
  },
} as const satisfies ClientBrandConfig;
