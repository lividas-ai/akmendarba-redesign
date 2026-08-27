import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "@fontsource-variable/instrument-sans";
import "@/styles/tokens.css";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RouteScrollReset } from "@/components/route-scroll-reset";
import { activeSiteConfig } from "@/client";
import { activeSiteManifest } from "@/client/manifest";

void activeSiteManifest;

export const metadata: Metadata = {
  metadataBase: new URL(activeSiteConfig.seo.canonicalUrl),
  title: {
    default: activeSiteConfig.seo.defaultTitle,
    template: activeSiteConfig.seo.titleTemplate,
  },
  description: activeSiteConfig.seo.description,
  applicationName: activeSiteConfig.identity.name,
  category: activeSiteConfig.seo.category,
  keywords: [...activeSiteConfig.seo.keywords],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: activeSiteConfig.seo.openGraph.title,
    description: activeSiteConfig.seo.openGraph.description,
    locale: activeSiteConfig.seo.openGraph.locale,
    type: "website",
    images: [
      {
        url: activeSiteConfig.seo.openGraph.image.src,
        width: activeSiteConfig.seo.openGraph.image.width,
        height: activeSiteConfig.seo.openGraph.image.height,
        alt: activeSiteConfig.seo.openGraph.image.alt,
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: activeSiteConfig.brand.background,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const clientTheme = {
    "--client-accent": activeSiteConfig.brand.accent,
    "--client-background": activeSiteConfig.brand.background,
  } as CSSProperties;

  return (
    <html lang={activeSiteConfig.htmlLang} data-scroll-behavior="smooth" style={clientTheme} suppressHydrationWarning>
      <body>
        <RouteScrollReset />
        <a className="skip-link" href="#turinys">
          {activeSiteConfig.ui.skipToContent}
        </a>
        <SiteHeader />
        <main id="turinys">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
