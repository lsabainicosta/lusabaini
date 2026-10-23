import "server-only";
import { createClient } from "@sanity/client";
import { unstable_cache } from "next/cache";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "0hp0ah4w";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "consultancy";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  // The API CDN can still serve a just-replaced document for a few seconds after
  // publish. These queries only run on a cache miss, so reading straight from the
  // API costs little and stops a revalidation from re-caching pre-publish content.
  useCdn: false,
  token: process.env.SANITY_READ_TOKEN,
  perspective: process.env.SANITY_READ_TOKEN ? "previewDrafts" : "published",
});

// Server-only, needs an Editor token; used to record guide orders.
export const sanityWriteClient = process.env.SANITY_WRITE_TOKEN
  ? sanityClient.withConfig({
      token: process.env.SANITY_WRITE_TOKEN,
      perspective: "published",
    })
  : null;

type CacheOptions = {
  tags?: string[];
  revalidate?: number;
};

export async function cachedSanityFetch<T>(
  query: string,
  options: CacheOptions = {}
): Promise<T> {
  const { tags, revalidate = 300 } = options;

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
