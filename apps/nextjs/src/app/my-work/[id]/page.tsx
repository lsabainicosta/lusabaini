import Image from "next/image";
import { notFound } from "next/navigation";
import { getClientResultById, getClientResultBySlug, getClientResults } from "@/lib/queries";
import { createSlug } from "@/lib/utils";
import TransitionLink from "@/components/motion/TransitionLink";
import { ArrowLeft, ArrowRight, Instagram } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const results = await getClientResults();
  return results.map((result) => ({
    id: result.clientName ? createSlug(result.clientName) : result._id,
  }));
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  
  // Try to find by slug first, then by _id
  let result = await getClientResultBySlug(id);
  if (!result) {
    result = await getClientResultById(id);
  }
  
  if (!result) {
    notFound();
  }

  // Get all results for navigation
  const allResults = await getClientResults();
  const currentIndex = allResults.findIndex((r) => r._id === result!._id);
  const nextResult = currentIndex >= 0 && currentIndex < allResults.length - 1 
    ? allResults[currentIndex + 1] 
    : null;
  const prevResult = currentIndex > 0 
    ? allResults[currentIndex - 1] 
    : null;

  const title = result.clientName || "Work";
  const description = result.description || "";
  const category = result.category || "";
  const year = new Date().getFullYear().toString(); // Default to current year, can be updated later

  return (
    <>
      {/* Hero Section */}
      <section className="w-full pt-20 pb-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative h-[500px] w-full overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl">
            {/* Background Image/Video */}
            {result.video?.url ? (
              <video
                src={result.video.url}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : result.image?.url ? (
              <Image
                src={result.image.url}
                alt={result.image.alt || title}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 1152px, 100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-black/10" />
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

            {/* Back Button */}
            <TransitionLink
              href="/my-work"
              className="absolute top-6 left-6 z-10 rounded-lg bg-[#f9f3eb]/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
            >
              <ArrowLeft className="inline-block mr-2 h-4 w-4" />
              Back
            </TransitionLink>

            {/* Navigation Arrow */}
            {nextResult && (
              <TransitionLink
                href={`/my-work/${nextResult.clientName ? createSlug(nextResult.clientName) : nextResult._id}`}
                className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-black transition-opacity hover:opacity-80"
                aria-label="Next project"
              >
                <ArrowRight className="h-5 w-5" />
              </TransitionLink>
            )}

            {/* Title and Description Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="max-w-3xl">
                <h1 className="mb-4 text-5xl font-medium tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
                  {title}
                </h1>
                {description && (
                  <p className="text-lg text-white/90 md:text-xl max-w-2xl">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between md:gap-12 bg-white/35 border border-black/10 rounded-[1rem] px-10 py-4">
            {/* Category */}
            <div>
              <div className="text-sm font-medium text-black/60 mb-2">Category</div>
              <div className="text-2xl font-semibold text-black">
                {category || "—"}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <div className="text-sm font-medium text-black/60 mb-2">Platforms</div>
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-black" />
                <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
            </div>

            {/* Year */}
            <div>
              <div className="text-sm font-medium text-black/60 mb-2">Year</div>
              <div className="text-2xl font-semibold text-black">{year}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}