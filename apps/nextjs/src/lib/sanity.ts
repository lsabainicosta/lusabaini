import "server-only";
import { createClient } from "@sanity/client";
import { unstable_cache } from "next/cache";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "0hp0ah4w";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn:
    process.env.NODE_ENV === "production" && !process.env.SANITY_READ_TOKEN,
  token: process.env.SANITY_READ_TOKEN,
  perspective: process.env.SANITY_READ_TOKEN ? "previewDrafts" : "published",
});

type CacheOptions = {
  tags?: string[];
  revalidate?: number;
};

/**
 * Cached Sanity fetch helper using Next.js ISR-style caching.
 * Defaults to 5 minutes and no tags if not provided.
 */
export async function cachedSanityFetch<T>(
  query: string,
  options: CacheOptions = {}
): Promise<T> {
  const { tags, revalidate = 300 } = options;

  // In development we want fresh data on every request (no Next.js caching layer).
  // You can also force-disable caching in any env by setting SANITY_DISABLE_CACHE=1.
  if (
    process.env.NODE_ENV === "development" ||
    process.env.SANITY_DISABLE_CACHE === "1"
  ) {
    return sanityClient.fetch<T>(query);
  }

  const run = unstable_cache(
    () => sanityClient.fetch<T>(query),
    [query, ...(tags ?? [])],
    { tags, revalidate }
  );

  return run();
}
