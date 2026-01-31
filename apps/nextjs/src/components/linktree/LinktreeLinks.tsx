"use client";

import { motion, MotionConfig } from "motion/react";
import {
  Link as LinkIcon,
  Mail,
  Briefcase,
  Phone,
  ShoppingBag,
  Calendar,
  Globe,
  type LucideIcon,
} from "lucide-react";
import {
  SiInstagram,
  SiTiktok,
  SiYoutube,
  SiSpotify,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { EASE_OUT, fadeInUpVariants } from "@/components/motion/fade";

type LinktreeLink = {
  label: string;
  url: string;
  icon?: string;
  _key?: string;
};

type LinktreeLinksProps = {
  links?: LinktreeLink[];
  className?: string;
};

const iconMap: Record<string, LucideIcon | IconType> = {
  link: LinkIcon,
  mail: Mail,
  briefcase: Briefcase,
  phone: Phone,
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  spotify: SiSpotify,
  shopping: ShoppingBag,
  calendar: Calendar,
  globe: Globe,
};

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
} as const;

const itemVariants = fadeInUpVariants({ y: 16, duration: 0.5 });

export default function LinktreeLinks({ links, className }: LinktreeLinksProps) {
  const resolvedLinks = (links ?? []).filter((link) => link.url && link.label);

  if (!resolvedLinks.length) return null;

  return (
    <MotionConfig transition={{ type: "tween", duration: 0.4, ease: EASE_OUT }}>
      <motion.div
        className={`flex w-full flex-col gap-3 ${className ?? ""}`}
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {resolvedLinks.map((link) => {
          const Icon = iconMap[link.icon ?? "link"] ?? LinkIcon;
          const isExternal =
            link.url.startsWith("http") || link.url.startsWith("mailto:");

          return (
            <motion.a
              key={link._key ?? link.label}
              href={link.url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/80 px-6 py-4 text-center shadow-sm backdrop-blur-md transition-shadow hover:shadow-lg"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              }}
            >
              <Icon className="absolute left-5 h-5 w-5 text-slate-600 transition-colors group-hover:text-slate-900" />
              <span className="text-base font-semibold text-slate-800 transition-colors group-hover:text-slate-900">
                {link.label}
              </span>
            </motion.a>
          );
        })}
      </motion.div>
    </MotionConfig>
  );
}
