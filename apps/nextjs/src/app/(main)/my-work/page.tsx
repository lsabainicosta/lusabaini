import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import { getClientResults, getMyWorkPageContent } from "@/lib/queries";
import { createSlug } from "@/lib/utils";
import TransitionLink from "@/components/motion/TransitionLink";

export default async function CaseStudiesPage() {
  const results = await getClientResults();
  const pageContent = await getMyWorkPageContent();

  return (
    <>
      <section className="w-full pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl flex flex-col gap-7">
            {pageContent?.badgeLabel && (
              <Reveal>
                <Badge className="w-fit px-4 py-1 bg-black/5 rounded-lg text-xs font-semibold uppercase tracking-wider text-black/60 border-transparent">
                  {pageContent.badgeLabel}
                </Badge>
              </Reveal>
            )}

            {pageContent?.headline && (
              <Reveal>
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
                  {pageContent.headline}
                </h1>
              </Reveal>
            )}

            {pageContent?.description && (
              <Reveal>
                <p className="text-xl text-black/60 max-w-2xl font-sans leading-relaxed">
                  {pageContent.description}
                </p>
              </Reveal>
            )}
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
              const slug = result.clientName ? createSlug(result.clientName) : result._id;
              const href = `/my-work/${slug}`;

              return (
                <Reveal key={result._id}>
                  <TransitionLink href={href} className="block group">
                    <article>
                      <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                        <div className="relative aspect-16/10 bg-black/5">
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
                              <div className="text-white text-4xl sm:text-5xl font-serif tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] max-w-md text-center">
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
                  </TransitionLink>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
