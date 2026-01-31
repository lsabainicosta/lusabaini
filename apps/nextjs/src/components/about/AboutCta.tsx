"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { EASE_OUT, FADE_IN_DELAY } from "@/components/motion/fade";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import { useContactModal } from "@/components/contact";

type Props = {
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  ctaButton?: { label?: string };
};

export default function AboutCta({
  headlineStart,
  headlineEmphasis,
  headlineEnd,
  description,
  ctaButton,
}: Props) {
  const { disableEnterAnimations } = useRouteTransition();
  const { openModal } = useContactModal();
  const [disableEnterAnimationsAtMount] = React.useState(
    () => disableEnterAnimations,
  );

  const titleStart = headlineStart || "Let's create something";
  const titleEmphasis = headlineEmphasis || "incredible";
  const titleEnd = headlineEnd || "together.";
  const body = description || "Ready to transform your social media presence?";
  const ctaLabel = ctaButton?.label || "Get in touch";

  return (
    <section className="w-full py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          className="relative rounded-[2.5rem] bg-linear-to-br from-(--brand-color) via-(--brand-soft) to-(--brand-light) p-10 md:p-14 overflow-hidden"
          {...(disableEnterAnimationsAtMount
            ? { initial: false }
            : {
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.5 },
                transition: {
                  duration: 0.85,
                  ease: EASE_OUT,
                  delay: FADE_IN_DELAY,
                },
              })}
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-(--brand-dark)/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative flex flex-col items-center text-center gap-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.04em] text-foreground">
              {titleStart}{" "}
              <span className="italic font-serif">{titleEmphasis}</span>
              {titleEnd ? ` ${titleEnd}` : ""}
            </h2>

            <p className="text-lg md:text-xl text-foreground/70 max-w-lg">
              {body}
            </p>

            <Button type="button" onClick={openModal} className="mt-4">
              {ctaLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
