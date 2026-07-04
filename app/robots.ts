import type { MetadataRoute } from "next";
import { defaultSeo } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"]
      }
    ],
    sitemap: `${defaultSeo.siteUrl}/sitemap.xml`
  };
}
