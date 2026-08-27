import type { NextConfig } from "next";
import { activeRedirects } from "./src/client/redirects";

const staticExport = process.env.STATIC_EXPORT === "true";

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
          return activeRedirects.map((redirect) => ({
            source: redirect.source,
            destination: redirect.destination,
            permanent: true,
          }));
        },
      }),
};

export default nextConfig;
