"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import {
  EASE_OUT,
  FADE_IN_DELAY,
  fadeInUpVariants,
} from "@/components/motion/fade";

type ServiceItem = {
  title: string;
  description?: string;
  videoSrc?: string;
};

type Props = {
  badgeLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  items?: ServiceItem[];
};

const defaultServices: Array<{
  title: string;
  description: string;
  video: string;
}> = [
  {
    title: "Content Creation",
    description:
      "TikToks, Reels, and UGC-style videos designed for reach, retention, and conversions, not just aesthetics.",
    video: "/videos/vid6.mp4",
  },
  {
    title: "Social Management",
    description:
      "Content planning, posting, and optimisation so your brand stays consistent and relevant.",
    video: "/videos/vid4.mp4",
  },
  {
    title: "Paid Media",
    description:
      "Scroll-stopping creatives built specifically for paid social, tested and refined based on performance.",
    video: "/videos/vid5.mp4",
  },
];

const Services = ({
  badgeLabel,
  headlineStart,
  headlineEmphasis,
  headlineEnd,
  items,
}: Props) => {
  const { disableEnterAnimations } = useRouteTransition();
  const [disableEnterAnimationsAtMount] = React.useState(
    () => disableEnterAnimations
  );
  const titleStart = headlineStart || "How I can";
  const titleEmphasis = headlineEmphasis || "grooow";
  const titleEnd = headlineEnd || "";

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: EASE_OUT,
        delay: index * 0.09,
        when: "beforeChildren",
        delayChildren: 0.12,
        staggerChildren: 0.06,
      },
    }),
  };

  const cardItemVariants = {
    ...fadeInUpVariants({ y: 10 }),
  };

  const services = items?.length
    ? items
        .filter((s) => s.title)
        .map((s) => ({
          title: s.title,
          description: s.description || "",
          video: s.videoSrc || "",
        }))
    : defaultServices;

  return (
    <section id="work" className="w-full py-28 md:py-32 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center text-center gap-6 mb-20"
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
          <Badge className="px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-foreground/5 text-foreground/70 ring-1 ring-foreground/10 backdrop-blur">
            {badgeLabel || "Services"}
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.04em] text-foreground">
            <span className="block text-lg md:text-xl font-medium tracking-[-0.02em] text-foreground/70">
              {titleStart}
            </span>
            <span className="block">
              {titleEnd}{" "}
              <span className="italic font-serif font-semibold text-foreground">
                {titleEmphasis}
              </span>
            </span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative rounded-[2.75rem] p-7 md:p-8 flex flex-col gap-6 bg-[oklch(1_0_0/0.58)] backdrop-blur-lg ring-1 ring-foreground/12 shadow-[0_14px_40px_rgba(0,0,0,0.12)] transition-[background,transform,box-shadow] duration-300 hover:bg-[oklch(1_0_0/0.64)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)]"
              {...(disableEnterAnimationsAtMount
                ? { initial: false }
                : {
                    initial: "hidden",
                    whileInView: "show",
                    viewport: {
                      once: true,
                      amount: 0.18,
                      margin: "0px 0px -12% 0px",
                    },
                    variants: cardVariants,
                    custom: index,
                  })}
            >
              <motion.div
                className="relative aspect-square w-full"
                variants={
                  disableEnterAnimationsAtMount ? undefined : cardItemVariants
                }
              >
                <div className="relative w-full h-full overflow-hidden rounded-[2.25rem] bg-foreground/[0.035] ring-1 ring-foreground/12 shadow-[0_12px_34px_rgba(0,0,0,0.12)]">
                  {/* subtle "short-form / social" silhouette */}
                  <div className="absolute inset-6 rounded-[1.8rem] bg-foreground/3 ring-1 ring-foreground/10">
                    <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-linear-to-b from-foreground/6 via-transparent to-transparent" />
                    <div className="absolute top-4 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-foreground/15" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                      <div className="h-2 w-2 rounded-full bg-foreground/16" />
                      <div className="h-2 w-2 rounded-full bg-foreground/12" />
                      <div className="h-2 w-2 rounded-full bg-foreground/10" />
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/6 ring-1 ring-foreground/12 backdrop-blur">
                      <Play className="ml-0.5 h-6 w-6 text-foreground/35" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col gap-3">
                <motion.h3
                  className="text-2xl font-medium tracking-tight text-foreground"
                  variants={
                    disableEnterAnimationsAtMount ? undefined : cardItemVariants
                  }
                >
                  {service.title}
                </motion.h3>
                <motion.p
                  className="text-base md:text-[1.05rem] text-foreground/65 leading-relaxed font-sans"
                  variants={
                    disableEnterAnimationsAtMount ? undefined : cardItemVariants
                  }
                >
                  {service.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
