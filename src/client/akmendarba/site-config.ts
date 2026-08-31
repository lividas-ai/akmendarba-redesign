import type { ClientSiteConfig } from "@/template/client-config";
import { akmendarbaBrandConfig } from "@/client/akmendarba/brand-config";
import { akmendarbaContactConfig } from "@/client/akmendarba/contact-config";
import { applications, gallerySections } from "@/client/akmendarba/data/content";

export const akmendarbaSiteConfig: ClientSiteConfig = {
  ...akmendarbaBrandConfig,
  id: "akmendarba",
  locale: "lt-LT",
  htmlLang: "lt",
  seo: {
    canonicalUrl: "https://akmendarba.lt",
    defaultTitle: "Paminklų gamyba, kapo dengimas, granito plokštės ir blokai | Akmendarba",
    titleTemplate: "%s | Akmendarba",
    description: "Paminklų gamyba, kapo dengimas, kapo aksesuarai ir granito plokščių apdirbimas vidaus bei išorės apdailai.",
    category: "stone fabrication",
    keywords: [
      "paminklų gamyba",
      "kapo dengimas",
      "kapo aksesuarai",
      "granito plokštės",
      "akmens apdirbimas",
      "Akmendarba",
    ],
    openGraph: {
      title: "Granito plokštės ir blokai | Akmendarba",
      description: "Granito ir marmuro gaminiai, akmens pjovimas bei apdirbimas Šiauliuose ir visoje Lietuvoje.",
      locale: "lt_LT",
      image: {
        src: "/client/akmendarba/source/Granite-1.jpg",
        width: 1024,
        height: 400,
        alt: "Skirtingų spalvų ir raštų akmens plokštės.",
      },
    },
  },
  hero: {
    titleLines: ["Granito blokai", "ir plokštės."],
    body: "Aukščiausios kokybės iš Skandinavijos.",
    primaryAction: { label: "Vidaus ir išorės apdaila", href: "/apdaila" },
    projectAction: { label: "Galerija", href: "/galerija" },
    posterAlt: "Skirtingų spalvų ir raštų akmens plokštės gamybos patalpose.",
  },
  header: {
    labels: {
      menu: "Meniu",
      openMenu: "Atverti meniu",
      closeMenu: "Uždaryti meniu",
      closeExpandedMenu: "Uždaryti išskleistą meniu",
      menuDialog: "Svetainės meniu",
      primaryNavigation: "Pagrindinis meniu",
      mobileSections: "Pagrindinės svetainės skiltys",
      backToMainMenu: "Grįžti į pagrindinį meniu",
      sectionFallback: "Skiltis",
    },
  },
  contact: akmendarbaContactConfig,
  footer: {
    summary: "Turime daugiametę patirtį dirbant su granito blokais ir plokštėmis.",
    groups: [
      {
        id: "production",
        label: "Produkcija",
        ariaLabel: "Produkcija",
        links: applications.map((item) => ({ label: item.shortTitle, href: item.href })),
      },
      {
        id: "gallery",
        label: "Galerija",
        ariaLabel: "Galerijos",
        links: [
          { label: "Visa galerija", href: "/galerija" },
          ...gallerySections.map((item) => ({ label: item.label, href: item.href })),
        ],
      },
      {
        id: "company",
        label: "Įmonė",
        ariaLabel: "Apie įmonę",
        links: [
          { label: "Apie mus", href: "/apie-mus" },
          { label: "Kontaktai", href: "/kontaktai" },
          { label: "Facebook", href: "https://www.facebook.com/akmendarba.granitas/", external: true },
          { label: "Instagram", href: "https://www.instagram.com/akmendarba/", external: true },
        ],
      },
    ],
    legalLinks: [
      { label: "Slapukai", href: "/slapukai" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
  pwa: {
    shortName: "Akmendarba",
    description: "Granito ir marmuro gaminiai bei akmens apdirbimas.",
    icon: { src: "/client/akmendarba/source/Logo-gradient-512x5125.png", sizes: "512x512", type: "image/png" },
  },
  sitemap: [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/apie-mus", changeFrequency: "monthly", priority: 0.7 },
    { path: "/paminklai", changeFrequency: "monthly", priority: 0.85 },
    { path: "/kapo-dengimai", changeFrequency: "monthly", priority: 0.85 },
    { path: "/aksesuarai", changeFrequency: "monthly", priority: 0.75 },
    { path: "/apdaila", changeFrequency: "monthly", priority: 0.85 },
    { path: "/galerija", changeFrequency: "monthly", priority: 0.8 },
    { path: "/galerija/paminklu-galerija", changeFrequency: "monthly", priority: 0.75 },
    { path: "/galerija/kapo-dengimu-galerija", changeFrequency: "monthly", priority: 0.75 },
    { path: "/galerija/aksesuaru-galerija", changeFrequency: "monthly", priority: 0.7 },
    { path: "/galerija/apdailos-galerija", changeFrequency: "monthly", priority: 0.75 },
    { path: "/kontaktai", changeFrequency: "monthly", priority: 0.8 },
    { path: "/slapukai", changeFrequency: "yearly", priority: 0.2 },
    { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.15 },
  ],
};
