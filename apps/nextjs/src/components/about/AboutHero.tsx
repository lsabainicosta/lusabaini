"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import { FADE_IN_DELAY, fadeInUpVariants } from "@/components/motion/fade";

type Props = {
  badgeLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  profileImage?: {
    url: string;
    alt?: string;
  };
};

export default function AboutHero({
  badgeLabel,
  headlineStart,
  headlineEmphasis,
  headlineEnd,
  description,
  profileImage,
}: Props) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const { disableEnterAnimations } = useRouteTransition();
  const [disableEnterAnimationsAtMount] = React.useState(
    () => disableEnterAnimations,
  );

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const update = () => setPrefersReducedMotion(mq.matches);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const shouldDisableMountAnimation =
    prefersReducedMotion || disableEnterAnimationsAtMount;

  const badge = badgeLabel || "About me";
  const titleStart = headlineStart || "The creator behind the";
  const titleEmphasis = headlineEmphasis || "content";
  const titleEnd = headlineEnd || "";
  const body =
    description ||
    "I'm Luiza — a social media strategist and short-form content creator helping brands turn scrolling audiences into loyal customers.";
  const imageUrl = profileImage?.url || "";
  const imageAlt = profileImage?.alt || "Luiza Sabaini Costa";

  return (
    <section className="relative w-full pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <motion.div
            className="flex-1 flex flex-col gap-7"
            initial={shouldDisableMountAnimation ? false : "hidden"}
            animate={shouldDisableMountAnimation ? undefined : "show"}
            variants={fadeInUpVariants({ y: 28, delay: FADE_IN_DELAY })}
          >
            <Badge className="w-fit px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-foreground/5 text-foreground/70 ring-1 ring-foreground/10 backdrop-blur">
              {badge}
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
              {titleStart}{" "}
              <span className="italic font-serif">{titleEmphasis}</span>
              {titleEnd ? ` ${titleEnd}` : ""}
            </h1>

            <p className="text-xl text-black/60 max-w-xl font-sans leading-relaxed">
              {body}
            </p>
          </motion.div>

          {/* Profile Image */}
          {imageUrl ? (
            <motion.div
              className="shrink-0"
              initial={shouldDisableMountAnimation ? false : "hidden"}
              animate={shouldDisableMountAnimation ? undefined : "show"}
              variants={fadeInUpVariants({ y: 28, delay: 0.18 })}
            >
              <div className="relative w-[320px] h-[400px] lg:w-[380px] lg:h-[480px]">
                <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-(--brand-color) to-(--brand-dark) opacity-20 blur-2xl" />
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 380px, 320px"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="shrink-0"
              initial={shouldDisableMountAnimation ? false : "hidden"}
              animate={shouldDisableMountAnimation ? undefined : "show"}
              variants={fadeInUpVariants({ y: 28, delay: 0.18 })}
            >
              <div className="relative w-[320px] h-[400px] lg:w-[380px] lg:h-[480px]">
                <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-(--brand-color) to-(--brand-dark) opacity-30" />
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-linear-to-br from-(--brand-soft) to-(--brand-color) flex items-center justify-center">
                  <span className="text-8xl font-serif italic text-white/40">
                    L
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
