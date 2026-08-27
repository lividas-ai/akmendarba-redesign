import type { ClientSiteConfig } from "@/template/client-config";
import { applications, materialCategories } from "@/client/granit-decor/data/content";
import { granitDecorBrandConfig } from "@/client/granit-decor/brand-config";
import { granitDecorContactConfig } from "@/client/granit-decor/contact-config";

export const granitDecorSiteConfig = {
  ...granitDecorBrandConfig,
  id: "granit-decor",
  locale: "lt-LT",
  htmlLang: "lt",
  seo: {
    canonicalUrl: "https://www.granitdecor.lt",
    defaultTitle: "Natūralaus akmens gaminiai | Granit Decor",
    titleTemplate: "%s | Granit Decor",
    description:
      "Granito, marmuro, kvarcito, onikso ir travertino gaminiai pagal individualų projektą. Matavimas, gamyba, pristatymas ir montavimas Lietuvoje.",
    category: "architecture",
    keywords: [
      "natūralus akmuo",
      "granitas",
      "marmuras",
      "kvarcitas",
      "akmens stalviršiai",
      "Granit Decor",
    ],
    openGraph: {
      title: "Natūralaus akmens gaminiai | Granit Decor",
      description: "Nuo akmens pasirinkimo ir matavimo iki gamybos, pristatymo bei montavimo.",
      locale: "lt_LT",
      image: {
        src: "/assets/portfolio/granit-decor-darbai-dvidesimt-keturi.webp",
        width: 1920,
        height: 1280,
        alt: "Individualiai įrengta virtuvė su akmens sala ir akmens sienos apdaila",
      },
    },
  },
  hero: {
    titleLines: ["Akmens sprendimai", "jūsų erdvei."],
    body:
      "Individualiai gaminami stalviršiai ir apdaila iš natūralaus akmens — nuo matavimo iki montavimo.",
    primaryAction: { label: "Pradėti projektą", href: "/projektas" },
    projectAction: { label: "Lenkta akmens sala", href: "/projektai" },
    posterAlt:
      "Granit Decor virtuvė su lenkta natūralaus akmens sala, akmens sienų apdaila ir individualiai gamintais baldais",
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
    contactLink: { label: "Kontaktai", href: "/kontaktai" },
    primaryAction: { label: "Aptarkime projektą", mobileLabel: "Aptarti projektą", href: "/projektas" },
    search: { label: "Paieška", openLabel: "Atverti paiešką" },
    savedItems: { label: "Išsaugota", countLabel: "Išsaugoti akmenys" },
  },
  contact: granitDecorContactConfig,
  footer: {
    summary: "Natūralaus akmens gaminiai pagal individualų projektą.",
    primaryAction: { label: "Aptarkime projektą", href: "/projektas" },
    groups: [
      {
        id: "products",
        label: "Gaminiai",
        ariaLabel: "Gaminiai",
        links: [
          { label: "Visi gaminiai", href: "/gaminiai" },
          ...applications.map((application) => ({
            label: application.shortTitle,
            href: application.href,
          })),
        ],
      },
      {
        id: "materials",
        label: "Akmuo",
        ariaLabel: "Akmens rūšys",
        links: [
          { label: "Visa akmens kolekcija", href: "/akmuo" },
          ...materialCategories.map((category) => ({ label: category.name, href: category.href })),
          { label: "Išsaugoti akmenys", href: "/akmuo?rodyti=issaugoti" },
        ],
      },
      {
        id: "company",
        label: "Įmonė",
        ariaLabel: "Apie įmonę ir darbą",
        links: [
          { label: "Projektai", href: "/projektai" },
          { label: "Kaip dirbame", href: "/kaip-dirbame" },
          { label: "Profesionalams", href: "/profesionalams" },
          { label: "Apie mus", href: "/apie-mus" },
          { label: "Žurnalas", href: "/zurnalas" },
          { label: "Memorialai", href: "/memorialai" },
          { label: "Kontaktai", href: "/kontaktai" },
        ],
      },
    ],
    legalLinks: [
      { label: "Privatumas", href: "/privatumas" },
      { label: "Naudojimo sąlygos", href: "/naudojimo-salygos" },
    ],
  },
  pwa: {
    shortName: "Granit Decor",
    description: "Individualūs natūralaus akmens gaminiai, projektavimas ir montavimas.",
    icon: { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
  },
  sitemap: [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/gaminiai", changeFrequency: "monthly", priority: 0.85 },
    { path: "/akmuo", changeFrequency: "weekly", priority: 0.9 },
    { path: "/projektai", changeFrequency: "monthly", priority: 0.85 },
    { path: "/kaip-dirbame", changeFrequency: "monthly", priority: 0.75 },
    { path: "/profesionalams", changeFrequency: "monthly", priority: 0.75 },
    { path: "/apie-mus", changeFrequency: "monthly", priority: 0.65 },
    { path: "/projektas", changeFrequency: "monthly", priority: 0.85 },
    { path: "/kontaktai", changeFrequency: "monthly", priority: 0.8 },
    { path: "/memorialai", changeFrequency: "monthly", priority: 0.65 },
    { path: "/zurnalas", changeFrequency: "monthly", priority: 0.65 },
    { path: "/zurnalas/kaip-rinktis-virtuves-stalvirsi", changeFrequency: "yearly", priority: 0.6 },
    { path: "/zurnalas/naturalaus-akmens-prieziura", changeFrequency: "yearly", priority: 0.6 },
    { path: "/privatumas", changeFrequency: "yearly", priority: 0.2 },
    { path: "/naudojimo-salygos", changeFrequency: "yearly", priority: 0.2 },
  ],
} as const satisfies ClientSiteConfig;
