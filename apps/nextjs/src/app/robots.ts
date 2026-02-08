import type { MetadataRoute } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: buildCanonicalUrl("/sitemap.xml"),
    host: new URL(buildCanonicalUrl("/")).host,
  };
}
