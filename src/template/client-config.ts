export type ClientLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterGroup = {
  id: string;
  label: string;
  ariaLabel: string;
  links: readonly ClientLink[];
};

export type SitemapRoute = {
  path: `/${string}` | "";
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

export type ClientBrandConfig = {
  siteId: string;
  identity: {
    name: string;
    wordmark: string;
    legalCopyrightName: string;
    homeAriaLabel: string;
  };
  brand: {
    logo: {
      src: string;
      width: number;
      height: number;
      sizes: string;
    };
    accent: string;
    background: string;
  };
  ui: {
    skipToContent: string;
    backToTop: string;
    playMotion: string;
    pauseMotion: string;
  };
};

export type ClientContactConfig = {
  phone?: { display: string; href: `tel:${string}` };
  email?: { display: string; href: `mailto:${string}` };
  address?: ClientLink;
  openingHours?: string;
  location?: {
    shortLabel: string;
    dialogAriaLabel: string;
    closeAriaLabel: string;
    kicker?: string;
    title: string;
    addressLines: readonly string[];
    note?: string;
    mapActionLabel: string;
    closeLabel: string;
  };
};

export type ClientSiteConfig = ClientBrandConfig & {
  id: string;
  locale: string;
  htmlLang: string;
  seo: {
    canonicalUrl: string;
    defaultTitle: string;
    titleTemplate: string;
    description: string;
    category?: string;
    keywords: readonly string[];
    openGraph: {
      title: string;
      description: string;
      locale: string;
      image: {
        src: string;
        width: number;
        height: number;
        alt: string;
      };
    };
  };
  hero: {
    titleLines: readonly [string, ...string[]];
    body?: string;
    primaryAction: ClientLink;
    projectAction?: ClientLink;
    posterAlt: string;
  };
  header: {
    labels: {
      menu: string;
      openMenu: string;
      closeMenu: string;
      closeExpandedMenu: string;
      menuDialog: string;
      primaryNavigation: string;
      mobileSections: string;
      backToMainMenu: string;
      sectionFallback: string;
    };
    contactLink?: ClientLink;
    primaryAction?: ClientLink & { mobileLabel?: string };
    search?: { label: string; openLabel: string };
    savedItems?: { label: string; countLabel: string };
  };
  contact: ClientContactConfig;
  footer: {
    summary?: string;
    primaryAction?: ClientLink;
    groups: readonly FooterGroup[];
    legalLinks: readonly ClientLink[];
  };
  pwa: {
    shortName: string;
    description: string;
    icon: { src: string; sizes: string; type: string };
  };
  sitemap: readonly SitemapRoute[];
};
