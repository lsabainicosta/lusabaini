import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { getClientResults } from "@/lib/queries";

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${count} star rating`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-[#f5a524]"
          aria-hidden="true"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function AvatarRow({ urls }: { urls: string[] }) {
  const safe = urls.filter(Boolean).slice(0, 5);
  if (safe.length === 0) return null;

  return (
    <div className="flex -space-x-2">
      {safe.map((url, idx) => (
        <div
          key={`${url}-${idx}`}
          className="relative h-8 w-8 overflow-hidden rounded-full border border-black/10 bg-white/60"
        >
          <Image
            src={url}
            alt=""
            fill
            className="object-cover"
            sizes="32px"
            priority={false}
          />
        </div>
      ))}
    </div>
  );
}

export default async function CaseStudiesPage() {
  const results = await getClientResults();

  return (
    <>
      <section className="w-full pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl flex flex-col gap-7">
            <Reveal>
              <Badge className="w-fit px-4 py-1 bg-black/5 rounded-lg text-xs font-semibold uppercase tracking-wider text-black/60 border-transparent">
                Partnerships
              </Badge>
            </Reveal>

            <Reveal>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
                My best work
              </h1>
            </Reveal>

            <Reveal>
              <p className="text-xl text-black/60 max-w-2xl font-sans leading-relaxed">
                See how we&apos;ve helped growing businesses transform their
                social media from a time drain into their most powerful growth
                engine. Every strategy is custom-built, every result is
                measurable.
              </p>
            </Reveal>

            <Reveal>
              <div className="flex items-center gap-4 pt-2">
                <AvatarRow
                  urls={(results ?? [])
                    .map((r) => r.image?.url || "")
                    .filter(Boolean)}
                />
                <div className="flex items-center gap-3">
                  <Stars />
                  <div className="text-sm font-medium text-black/60">
                    Grown over 176+ creators
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="w-full pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {(results ?? []).map((result) => {
              const title =
                result.clientName ||
                result.imageOverlayText ||
                result.headlineEmphasis ||
                "Case study";
              const category = result.category?.trim();
              const overlay = result.imageOverlayText || result.clientName;

              return (
                <Reveal key={result._id}>
                  <article className="group">
                    <div className="bg-white/35 border border-black/10 rounded-[2.5rem] p-3 sm:p-4">
                      <div className="relative overflow-hidden rounded-[2rem] aspect-16/10 bg-black/5">
                        {result.image?.url ? (
                          <Image
                            src={result.image.url}
                            alt={result.image.alt || title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="(min-width: 1024px) 560px, 92vw"
                            priority={false}
                          />
                        ) : null}

                        {overlay ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-white text-4xl sm:text-5xl font-serif tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                              {overlay}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 bg-black/5 border border-black/10 rounded-2xl px-5 sm:px-6 py-4 flex items-center justify-between">
                      <div className="text-lg sm:text-xl font-medium tracking-[-0.04em] text-black">
                        {title}
                      </div>
                      {category ? (
                        <div className="text-sm font-medium text-black/50">
                          {category}
                        </div>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
