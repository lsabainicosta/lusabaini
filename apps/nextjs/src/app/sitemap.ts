import type { MetadataRoute } from "next";
import {
  getClientResults,
  getLegalPageSitemapEntries,
  resolveClientResultSlug,
} from "@/lib/queries";
import { buildCanonicalUrl, isLegalSlugIndexable } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [results, legalEntries] = await Promise.all([
    getClientResults(),
    getLegalPageSitemapEntries(),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: buildCanonicalUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: buildCanonicalUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: buildCanonicalUrl("/my-work"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: buildCanonicalUrl("/contact"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: buildCanonicalUrl("/socials"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  for (const result of results) {
    const slug = resolveClientResultSlug(result);
    if (!slug) continue;

    entries.push({
      url: buildCanonicalUrl(`/my-work/${slug}`),
      ...(result.updatedAt ? { lastModified: new Date(result.updatedAt) } : {}),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const entry of legalEntries) {
    const slug = entry.slug?.trim().toLowerCase();
    if (!slug || !isLegalSlugIndexable(slug)) continue;
    entries.push({
      url: buildCanonicalUrl(`/legal/${slug}`),
      ...(entry.updatedAt ? { lastModified: new Date(entry.updatedAt) } : {}),
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  const deduped = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of entries) {
    deduped.set(entry.url, entry);
  }

  return [...deduped.values()];
}
