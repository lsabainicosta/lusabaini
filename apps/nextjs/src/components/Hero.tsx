"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import StoryMockup from "./StoryMockup";
import { motion } from "motion/react";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import TransitionLink from "@/components/motion/TransitionLink";
import { FADE_IN_DELAY, fadeInUpVariants } from "@/components/motion/fade";

type Props = {
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  primaryCta?: { href?: string; label?: string };
  secondaryCta?: { href?: string; label?: string };
  carouselVideos?: Array<{ url?: string; title?: string }>;
};

const Hero = ({
  headlineStart,
  headlineEmphasis,
  headlineEnd,
  description,
  primaryCta,
  secondaryCta,
  carouselVideos,
}: Props) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const { disableEnterAnimations } = useRouteTransition();
  const [disableEnterAnimationsAtMount] = React.useState(
    () => disableEnterAnimations
  );
  const [showStoryMockup, setShowStoryMockup] = React.useState(
    () => !disableEnterAnimationsAtMount
  );

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const update = () => setPrefersReducedMotion(mq.matches);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // `StoryMockup` is the heaviest part of the home route (videos + observers + RAF loops).
  // When navigating *to* Home, defer mounting it by a couple frames so the page transition
  // can complete without dropped frames.
  React.useEffect(() => {
    if (!disableEnterAnimationsAtMount) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => setShowStoryMockup(true));
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [disableEnterAnimationsAtMount]);

  const titleStart = headlineStart || "Short form content that";
  const titleEmphasis = headlineEmphasis || "performs";
  const titleEnd = headlineEnd || "";
  const body =
    description ||
    "I help brands grow on social through high-performing short-form video, strategy, and hands-on execution.";
  const primaryHref = primaryCta?.href || "/book-a-call";
  const primaryLabel = primaryCta?.label || "Book a call";
  const secondaryHref = secondaryCta?.href || "#work";
  const secondaryLabel = secondaryCta?.label || "View my work";

  const shouldDisableMountAnimation =
    prefersReducedMotion || disableEnterAnimationsAtMount;

  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 py-4 lg:py-8 flex flex-col lg:flex-row items-center gap-16">
      {/* Left Content */}
      <motion.div
        className="flex-1 flex flex-col items-start gap-8 z-10"
        initial={shouldDisableMountAnimation ? false : "hidden"}
        animate={shouldDisableMountAnimation ? undefined : "show"}
        variants={fadeInUpVariants({ y: 28, delay: FADE_IN_DELAY })}
      >
        <h2 className="text-5xl lg:text-7xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
          {titleStart} <br />
          actually <span className="italic font-serif">{titleEmphasis}</span>
          {titleEnd ? ` ${titleEnd}` : ""}
        </h2>

        <p className="text-xl text-black/60 max-w-md font-sans leading-relaxed">
          {body}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            asChild
            className="rounded-full bg-black text-white px-8 py-4 h-auto text-lg font-medium hover:bg-black/90 transition-all border-none"
          >
            <TransitionLink href={primaryHref}>{primaryLabel}</TransitionLink>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 py-4 h-auto text-lg font-medium border-black/15 shadow-none hover:bg-black/5"
          >
            <TransitionLink href={secondaryHref}>
              {secondaryLabel}
            </TransitionLink>
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="flex-1 relative flex justify-center lg:justify-end"
        initial={shouldDisableMountAnimation ? false : "hidden"}
        animate={shouldDisableMountAnimation ? undefined : "show"}
        variants={fadeInUpVariants({ y: 28, delay: 0.18 })}
      >
        {showStoryMockup ? (
          <StoryMockup stories={carouselVideos} />
        ) : (
          <div className="relative w-[350px]">
            <div className="relative aspect-9/16 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-black/5" />
          </div>
        )}

        {/* Visual Flair (Optional background glow) */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-(--brand-dark)/10 blur-[120px] rounded-full" />
      </motion.div>
    </section>
  );
};

export default Hero;
