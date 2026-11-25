import "server-only";

// ponytail: in-memory per-IP limit, fine for one container; resets on restart.
// Move to Redis/Upstash if the site ever runs on more than one instance.
const WINDOW_MS = 60 * 60 * 1000;
const buckets = new Map<string, number[]>();

export function isRateLimited(request: Request, key: string, limit = 5) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const hits = (buckets.get(id) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  buckets.set(id, hits);
  return hits.length > limit;
}
