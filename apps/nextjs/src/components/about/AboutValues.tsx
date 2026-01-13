"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Target,
  Heart,
  Zap,
  Star,
  Users,
  Lightbulb,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { EASE_OUT, FADE_IN_DELAY } from "@/components/motion/fade";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import type { AboutValue } from "@/lib/queries";

type Props = {
  philosophyTitle?: string;
  philosophyContent?: string;
  values?: AboutValue[];
};

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  target: Target,
  heart: Heart,
  zap: Zap,
  star: Star,
  users: Users,
  lightbulb: Lightbulb,
  rocket: Rocket,
};

const defaultValues: AboutValue[] = [
  {
    title: "Authenticity First",
    description:
      "Real content beats polished perfection. I create videos that feel genuine and connect with audiences.",
    icon: "heart",
  },
  {
    title: "Data-Driven",
    description:
      "Every decision is backed by metrics. I track, test, and optimize for maximum performance.",
    icon: "target",
  },
  {
    title: "Always Learning",
    description:
      "Social media evolves daily. I stay ahead of trends so your content never falls behind.",
    icon: "lightbulb",
  },
];

export default function AboutValues({
  philosophyTitle,
  philosophyContent,
  values,
}: Props) {
  const { disableEnterAnimations } = useRouteTransition();
  const [disableEnterAnimationsAtMount] = React.useState(
    () => disableEnterAnimations
  );

  const sectionTitle = philosophyTitle || "Philosophy";
  const sectionContent =
    philosophyContent ||
    "I don't believe in one-size-fits-all solutions. Every brand has a unique voice, and my job is to amplify it through content that connects, engages, and converts.";

  const displayValues = values?.length ? values : defaultValues;

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: EASE_OUT,
        delay: index * 0.1,
      },
    }),
  };

  return (
    <section className="w-full py-20 md:py-28 bg-gradient-to-b from-transparent via-foreground/[0.02] to-transparent">
      <div className="max-w-6xl mx-auto px-6">
        {/* Philosophy Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
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
          <h2 className="text-4xl md:text-5xl font-medium tracking-[-0.04em] text-foreground mb-6">
            <span className="italic font-serif">{sectionTitle}</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 leading-relaxed">
            {sectionContent}
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayValues.map((value, index) => {
            const IconComponent = iconMap[value.icon || "sparkles"] || Sparkles;
            return (
              <motion.div
                key={value._key || index}
                className="group relative rounded-[2rem] p-7 md:p-8 flex flex-col gap-5 bg-[oklch(1_0_0/0.58)] backdrop-blur-lg ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-[oklch(1_0_0/0.7)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1"
                {...(disableEnterAnimationsAtMount
                  ? { initial: false }
                  : {
                      initial: "hidden",
                      whileInView: "show",
                      viewport: {
                        once: true,
                        amount: 0.2,
                        margin: "0px 0px -10% 0px",
                      },
                      variants: cardVariants,
                      custom: index,
                    })}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-color)] to-[var(--brand-soft)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 text-foreground/80" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {value.title}
                  </h3>
                  {value.description ? (
                    <p className="text-base text-foreground/60 leading-relaxed">
                      {value.description}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
