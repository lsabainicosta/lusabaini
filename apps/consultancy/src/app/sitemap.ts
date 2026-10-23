import type { MetadataRoute } from "next";
import { buildCanonicalUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/servicos", "/sobre", "/guias", "/contato"];
  return paths.map((pathname) => ({
    url: buildCanonicalUrl(pathname),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: pathname === "/" ? 1 : 0.7,
  }));
}
