"use client";

import * as React from "react";
import { motion } from "motion/react";
import { EASE_OUT, FADE_IN_DELAY } from "@/components/motion/fade";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import type { AboutJourneyItem } from "@/lib/queries";

type Props = {
  title?: string;
  items?: AboutJourneyItem[];
};

const defaultJourney: AboutJourneyItem[] = [
  {
    year: "2019",
    title: "Started Creating",
    description:
      "Began experimenting with social media content, discovering my passion for short-form video.",
  },
  {
    year: "2021",
    title: "First Brand Partnerships",
    description:
      "Started working with brands, helping them build authentic connections through content.",
  },
  {
    year: "2023",
    title: "Full-Time Creator",
    description:
      "Transitioned to full-time content creation and social media strategy, working with clients globally.",
  },
  {
    year: "Now",
    title: "Growing Together",
    description:
      "Helping brands of all sizes transform their social presence and turn views into customers.",
  },
];

export default function AboutJourney({ title, items }: Props) {
  const { disableEnterAnimations } = useRouteTransition();
  const [disableEnterAnimationsAtMount] = React.useState(
    () => disableEnterAnimations
  );

  const sectionTitle = title || "My Journey";
  const displayItems = items?.length ? items : defaultJourney;

  // Don't render if no items
  if (!displayItems.length) return null;

  return (
    <section className="w-full py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          {...(disableEnterAnimationsAtMount
            ? { initial: false }
            : {
                initial: { opacity: 0, y: 26 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.75 },
                transition: {
                  duration: 0.85,
                  ease: EASE_OUT,
                  delay: FADE_IN_DELAY,
                },
              })}
        >
          <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.04em] text-foreground">
            <span className="italic font-serif">{sectionTitle}</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent md:-translate-x-1/2" />

          {/* Timeline items */}
          <div className="flex flex-col gap-12">
            {displayItems.map((item, index) => (
              <motion.div
                key={item._key || index}
                className={`relative flex flex-col md:flex-row gap-6 md:gap-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                {...(disableEnterAnimationsAtMount
                  ? { initial: false }
                  : {
                      initial: { opacity: 0, y: 30 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: {
                        once: true,
                        amount: 0.4,
                        margin: "0px 0px -8% 0px",
                      },
                      transition: {
                        duration: 0.85,
                        ease: EASE_OUT,
                        delay: FADE_IN_DELAY + index * 0.1,
                      },
                    })}
              >
                {/* Year bubble */}
                <div
                  className={`absolute left-8 md:left-1/2 top-0 -translate-x-1/2 z-10`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand-color)] to-[var(--brand-soft)] flex items-center justify-center shadow-lg ring-4 ring-background">
                    <span className="text-sm font-bold text-foreground/80">
                      {item.year}
                    </span>
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`flex-1 ml-20 md:ml-0 ${
                    index % 2 === 0
                      ? "md:text-right md:pr-20"
                      : "md:text-left md:pl-20"
                  }`}
                >
                  <div className="bg-[oklch(1_0_0/0.5)] backdrop-blur-sm rounded-2xl p-6 ring-1 ring-foreground/8 shadow-sm">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-base text-foreground/60 leading-relaxed">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Spacer for alternating layout on desktop */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
