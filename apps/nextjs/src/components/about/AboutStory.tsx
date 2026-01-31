"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { EASE_OUT, FADE_IN_DELAY } from "@/components/motion/fade";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";

type Props = {
  title?: string;
  content?: string;
  image?: {
    url: string;
    alt?: string;
  };
};

export default function AboutStory({ title, content, image }: Props) {
  const { disableEnterAnimations } = useRouteTransition();
  const [disableEnterAnimationsAtMount] = React.useState(
    () => disableEnterAnimations
  );

  const sectionTitle = title || "My Story";
  const sectionContent =
    content ||
    "From my early days experimenting with social media to working with brands across the globe, I've always been passionate about creating content that doesn't just look good — it performs. I believe in the power of authenticity, strategic thinking, and relentless testing to find what truly resonates with audiences.";

  const imageUrl = image?.url || "";
  const imageAlt = image?.alt || "Story image";

  return (
    <section className="w-full py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image */}
          {imageUrl ? (
            <motion.div
              className="shrink-0 order-2 lg:order-1"
              {...(disableEnterAnimationsAtMount
                ? { initial: false }
                : {
                    initial: { opacity: 0, x: -30 },
                    whileInView: { opacity: 1, x: 0 },
                    viewport: { once: true, amount: 0.4 },
                    transition: {
                      duration: 0.85,
                      ease: EASE_OUT,
                      delay: FADE_IN_DELAY,
                    },
                  })}
            >
              <div className="relative w-[300px] h-[380px] lg:w-[360px] lg:h-[440px]">
                <div className="absolute inset-0 rounded-[2rem] bg-linear-to-br from-(--brand-color) to-(--brand-dark) opacity-15 blur-xl -rotate-3" />
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-4 border-white shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 360px, 300px"
                  />
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Content */}
          <motion.div
            className={`flex-1 flex flex-col gap-6 order-1 lg:order-2 ${!imageUrl ? "max-w-3xl mx-auto text-center" : ""}`}
            {...(disableEnterAnimationsAtMount
              ? { initial: false }
              : {
                  initial: { opacity: 0, y: 26 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.5 },
                  transition: {
                    duration: 0.85,
                    ease: EASE_OUT,
                    delay: FADE_IN_DELAY,
                  },
                })}
          >
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="h-px w-10 bg-foreground/20" />
              <span className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
                {sectionTitle}
              </span>
            </div>

            <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-sans">
              {sectionContent}
            </p>

            {/* Decorative quote mark */}
            <div className="mt-4">
              <svg
                className="w-12 h-12 text-foreground/10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.318.142-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.945-.33.358-.656.734-.909 1.162C3.3 8.182 3.072 8.64 2.9 9.06c-.238.596-.381 1.18-.468 1.689-.083.493-.119.948-.119 1.335 0 .217.012.417.043.596.042.236.095.44.162.61.079.186.169.33.267.436.1.103.199.178.285.225.08.048.152.068.213.068H6.5c.553 0 1-.448 1-1V11c0-.552-.447-1-1-1zm10 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-.485-1.938-.597.144c-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.945-.33.358-.656.734-.909 1.162-.264.397-.492.855-.66 1.275-.238.596-.381 1.18-.468 1.689-.083.493-.119.948-.119 1.335 0 .217.012.417.043.596.042.236.095.44.162.61.079.186.169.33.267.436.1.103.199.178.285.225.08.048.152.068.213.068h4.5c.553 0 1-.448 1-1V11c0-.552-.447-1-1-1z" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
