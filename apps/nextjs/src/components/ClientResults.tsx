import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { ClientResult } from "@/lib/queries";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

type Props = {
  results?: ClientResult[];
};

export default function ClientResults({ results }: Props) {
  const items = (results ?? []).filter(
    (r) =>
      (r.headlineStart && r.headlineEmphasis) ||
      (r.description && (r.image?.url || r.video?.url)) ||
      (r.stats?.length ?? 0) > 0
  );

  if (items.length === 0) return null;

  // Only show last 3 updated items (most recently updated first)
  const displayItems = items.slice(0, 3);

  return (
    <section className="w-full py-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-20">
        {displayItems.map((result, index) => {
          const isEven = index % 2 === 0;
          const TextContent = (
            <div className="flex flex-col items-start gap-8">
              <StaggerItem>
                <Badge className="px-4 py-1 bg-black/5 rounded-lg text-xs font-semibold uppercase tracking-wider text-black/60 border-transparent">
                  {result.badgeLabel || "Client results"}
                </Badge>
              </StaggerItem>

              <StaggerItem y={26}>
                <h2 className="text-5xl lg:text-6xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
                  {result.headlineStart}{" "}
                  <span className="italic font-serif">
                    {result.headlineEmphasis}
                  </span>
                  {result.headlineEnd ? ` ${result.headlineEnd}` : ""}
                </h2>
              </StaggerItem>

              {result.description ? (
                <StaggerItem>
                  <p className="text-xl text-black/60 max-w-xl font-sans leading-relaxed">
                    {result.description}
                  </p>
                </StaggerItem>
              ) : null}

              {result.stats?.length ? (
                <StaggerItem>
                  <Stagger
                    className="w-full grid grid-cols-1 sm:grid-cols-2 gap-10 pt-6"
                    amount={0.6}
                    stagger={0.07}
                    delayChildren={0.03}
                  >
                    {result.stats.slice(0, 4).map((stat) => (
                      <StaggerItem
                        key={stat._key ?? `${stat.label}-${stat.value}`}
                        y={16}
                      >
                        <div className="text-6xl lg:text-6xl font-medium tracking-[-0.04em] text-black">
                          {stat.value}
                        </div>
                        <div className="pt-3">
                          <div className="text-2xl font-medium tracking-[-0.04em] text-black">
                            {stat.label}
                          </div>
                          {stat.subLabel ? (
                            <div className="text-base text-black/50 font-sans mt-1">
                              {stat.subLabel}
                            </div>
                          ) : null}
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </StaggerItem>
              ) : null}
            </div>
          );

          const ImageContent = (
            <div className="w-full">
              <StaggerItem y={22}>
                <div className="bg-white/35 border border-black/10 rounded-[2.5rem] p-1 lg:p-2">
                  <Stagger
                    className="relative overflow-hidden rounded-[2rem] aspect-square bg-black/5"
                    amount={0.6}
                    stagger={0.08}
                    delayChildren={0.04}
                  >
                    <StaggerItem y={0} className="absolute inset-0">
                      {result.video?.url ? (
                        <video
                          src={result.video.url}
                          poster={result.image?.url || undefined}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          aria-label={
                            result.clientName || "Client result video"
                          }
                        />
                      ) : result.image?.url ? (
                        <Image
                          src={result.image.url}
                          alt={
                            result.image.alt ||
                            result.clientName ||
                            "Client result"
                          }
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 520px, 92vw"
                          priority={false}
                        />
                      ) : null}
                    </StaggerItem>

                    {(result.imageOverlayText || result.clientName) && (
                      <StaggerItem
                        y={10}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="text-white text-4xl lg:text-5xl font-serif tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] max-w-md text-center">
                          {result.imageOverlayText || result.clientName}
                        </div>
                      </StaggerItem>
                    )}
                  </Stagger>
                </div>
              </StaggerItem>
            </div>
          );

          return (
            <Stagger
              key={result._id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center ${
                !isEven ? "lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1" : ""
              }`}
              amount={0.5}
              stagger={0.09}
              delayChildren={0.02}
            >
              {TextContent}
              {ImageContent}
            </Stagger>
          );
        })}
      </div>
    </section>
  );
}
