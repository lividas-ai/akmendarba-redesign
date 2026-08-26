import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "true";

const redirects = [
  ["/naturalus-akmuo", "/akmuo"],
  ["/granitas", "/akmuo?tipas=granitas"],
  ["/marmuras", "/akmuo?tipas=marmuras"],
  ["/oniksas", "/akmuo?tipas=oniksas"],
  ["/travertinas", "/akmuo?tipas=travertinas"],
  ["/kvarcitas", "/akmuo?tipas=kvarcitas"],
  ["/naturalaus-akmens-gaminiai", "/gaminiai"],
  ["/virtuves-stalvirsiai-gamyba", "/gaminiai/virtuves-stalvirsiai"],
  ["/vonios-stalvirsiai-gamyba", "/gaminiai/vonios-stalvirsiai"],
  ["/židinių-apdaila", "/gaminiai/zidiniu-apdaila"],
  ["/laiptai-ir-laiptų-pakopos", "/gaminiai/laiptai-ir-laiptu-pakopos"],
  ["/akmeninės-palangės", "/gaminiai/akmens-palanges"],
  ["/grindų-danga", "/gaminiai/grindu-danga"],
  ["/sienų-apdaila", "/gaminiai/sienu-apdaila"],
  ["/vidaus-baldai", "/gaminiai/vidaus-baldai"],
  ["/lauko-baldai", "/gaminiai/lauko-baldai"],
  ["/fasadų-apdaila", "/gaminiai/fasadu-apdaila"],
  ["/kolonos", "/gaminiai/kolonos"],
  ["/antkapiai", "/gaminiai/antkapiai-ir-paminklai"],
  ["/akmens-gaminiai", "/projektai"],
] as const;

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: staticExport
    ? { unoptimized: true }
    : {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 30,
      },
  poweredByHeader: false,
  ...(staticExport
    ? { output: "export" as const }
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
              ],
            },
            {
              source: "/assets/:path*",
              headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
          ];
        },
        async redirects() {
          return redirects.map(([source, destination]) => ({
            source,
            destination,
            permanent: true,
          }));
        },
      }),
};

export default nextConfig;
