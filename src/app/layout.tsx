import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans";
import "@/styles/tokens.css";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RouteScrollReset } from "@/components/route-scroll-reset";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.granitdecor.lt"),
  title: {
    default: "Natūralaus akmens gaminiai | Granit Decor",
    template: "%s | Granit Decor",
  },
  description:
    "Granito, marmuro, kvarcito, onikso ir travertino gaminiai pagal individualų projektą. Matavimas, gamyba, pristatymas ir montavimas Lietuvoje.",
  applicationName: "Granit Decor",
  category: "architecture",
  keywords: [
    "natūralus akmuo",
    "granitas",
    "marmuras",
    "kvarcitas",
    "akmens stalviršiai",
    "Granit Decor",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Natūralaus akmens gaminiai | Granit Decor",
    description:
      "Nuo akmens pasirinkimo ir matavimo iki gamybos, pristatymo bei montavimo.",
    locale: "lt_LT",
    type: "website",
    images: [
      {
        url: "/assets/portfolio/granit-decor-darbai-dvidesimt-keturi.webp",
        width: 1920,
        height: 1280,
        alt: "Individualiai įrengta virtuvė su akmens sala ir akmens sienos apdaila",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f2eb",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <RouteScrollReset />
        <a className="skip-link" href="#turinys">
          Pereiti prie turinio
        </a>
        <SiteHeader />
        <main id="turinys">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
