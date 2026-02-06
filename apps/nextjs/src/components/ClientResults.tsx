"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { ClientResult } from "@/lib/queries";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { motion } from "motion/react";
import { EASE_OUT } from "@/components/motion/fade";

type Props = {
  results?: ClientResult[];
};

// Individual result card animation
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: EASE_OUT,
    },
  },
};

export default function ClientResults({ results }: Props) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const update = () => setPrefersReducedMotion(mq.matches);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

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

              <StaggerItem y={24}>
                <h2 className="text-5xl lg:text-6xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
                  {result.headlineStart}{" "}
                  <span className="italic font-serif">
                    {result.headlineEmphasis}
                  </span>
                  {result.headlineEnd ? ` ${result.headlineEnd}` : ""}
                </h2>
              </StaggerItem>

              {result.description ? (
                <StaggerItem y={20}>
                  <p className="text-xl text-black/60 max-w-xl font-sans leading-relaxed">
                    {result.description}
                  </p>
                </StaggerItem>
              ) : null}

              {result.stats?.length ? (
                <StaggerItem y={18}>
                  <Stagger
                    className="w-full grid grid-cols-1 sm:grid-cols-2 gap-10 pt-6"
                    amount={0.2}
                    stagger={0.1}
                    delayChildren={0.05}
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
              <StaggerItem y={24}>
                <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                  <Stagger
                    className="relative aspect-square bg-black/5"
                    amount={0.5}
                    stagger={0.12}
                    delayChildren={0.06}
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
                        y={12}
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
            <motion.div
              key={result._id}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, amount: 0.08, margin: "0px 0px -12% 0px" }}
              variants={cardVariants}
            >
              <Stagger
                className={`grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center ${
                  !isEven ? "lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1" : ""
                }`}
                amount={0.18}
                stagger={0.12}
                delayChildren={0.04}
              >
                {TextContent}
                {ImageContent}
              </Stagger>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
