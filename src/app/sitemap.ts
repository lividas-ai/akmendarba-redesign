import type { MetadataRoute } from "next";
import { applications, projects } from "@/data/content";
import { materials } from "@/data/materials";

export const dynamic = "force-static";

const baseUrl = "https://www.granitdecor.lt";

const staticRoutes = [
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
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...applications.map((application) => ({
      url: `${baseUrl}/gaminiai/${application.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...materials.map((material) => ({
      url: `${baseUrl}/akmuo/${material.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
    ...projects.map((project) => ({
      url: `${baseUrl}/projektai/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.55,
    })),
  ];
}
