"use client";
import { useState, type ComponentType, type CSSProperties } from "react";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { Mail, Phone, Briefcase, LinkIcon } from "lucide-react";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import { EASE_OUT, fadeInUpVariants } from "@/components/motion/fade";

type SocialLink = {
  label: string;
  icon?: string;
  url: string;
  _key?: string;
  color?: string;
  backgroundColor?: string;
};

const iconMap: Record<
  string,
  ComponentType<{ className?: string; style?: CSSProperties }>
> = {
  briefcase: Briefcase,
  mail: Mail,
  phone: Phone,
  link: LinkIcon,
};

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
} as const;

// Child animations — both fade + slide animate together.
const itemVariants = fadeInUpVariants({ y: 18 });

// Tailwind tile style
const tileClassName =
  "relative flex min-h-[64px] w-full items-center justify-center gap-3 overflow-hidden rounded-3xl bg-slate-900/95 shadow-[0_18px_55px_rgba(15,23,42,0.35)] transition-transform group cursor-pointer select-none sm:min-h-[72px] md:min-h-[80px]";

export default function SocialButtons({ links }: { links?: SocialLink[] }) {
  const { disableEnterAnimations } = useRouteTransition();
  const [disableEnterAnimationsAtMount] = useState(
    () => disableEnterAnimations
  );

  const resolvedLinks = (links ?? []).filter((link) => link.url && link.label);
  if (!resolvedLinks.length) return null;

  return (
    <MotionConfig
      transition={{ type: "tween", duration: 0.85, ease: EASE_OUT }}
    >
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 sm:px-6 md:grid md:max-w-6xl md:grid-cols-2 md:gap-4 md:px-8 lg:gap-5"
        variants={listVariants}
        {...(disableEnterAnimationsAtMount
          ? { initial: false }
          : {
              initial: "hidden",
              whileInView: "show",
              viewport: { once: true, amount: 0.2 },
            })}
      >
        {resolvedLinks.map((link) => {
          const Icon = iconMap[link.icon ?? ""] ?? LinkIcon;
          const isInternal = link.url.startsWith("/");
          const color = link.color?.trim()?.length
            ? link.color
            : "var(--brand-soft, #ffe6f5)";
          const backgroundColor = link.backgroundColor?.trim()?.length
            ? link.backgroundColor
            : "rgba(15, 23, 42, 0.95)";

          const content = (
            <>
              <div
                className="absolute inset-0 rounded-3xl bg-slate-900/95"
                style={{ backgroundColor }}
              />
              <div
                className="relative z-10 flex w-full items-center justify-center gap-3 px-4 py-3 sm:py-4 md:justify-start md:pl-14 md:pr-6"
                style={{ color }}
              >
                <Icon
                  className="absolute left-5 h-5 w-5 sm:h-6 sm:w-6 md:left-6"
                  style={{ color }}
                />
                <span className="text-base font-semibold sm:text-lg md:text-[18px]">
                  {link.label}
                </span>
              </div>
            </>
          );

          const MotionTile = isInternal ? motion.div : motion.a;

          return isInternal ? (
            <Link key={link._key ?? link.label} href={link.url}>
              <MotionTile
                variants={
                  disableEnterAnimationsAtMount ? undefined : itemVariants
                }
                whileHover={{ scale: 1.012 }}
                whileTap={{ scale: 0.985 }}
                className={tileClassName}
              >
                {content}
              </MotionTile>
            </Link>
          ) : (
            <MotionTile
              key={link._key ?? link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={
                disableEnterAnimationsAtMount ? undefined : itemVariants
              }
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.985 }}
              className={tileClassName}
            >
              {content}
            </MotionTile>
          );
        })}
      </motion.div>
    </MotionConfig>
  );
}
