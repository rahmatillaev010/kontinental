import type { MetadataRoute } from "next";
import { defaultSeo, publicRoutes } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: `${defaultSeo.siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.path === "/" ? 1 : 0.78
  }));
}
