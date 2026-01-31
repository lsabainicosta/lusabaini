"use client";

import { motion } from "motion/react";
import { Mail } from "lucide-react";
import {
  SiInstagram,
  SiLinkedin,
  SiTiktok,
  SiYoutube,
  SiFacebook,
  SiX,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { fadeInUpVariants } from "@/components/motion/fade";

type SocialLink = {
  icon: string;
  href: string;
  label?: string;
  _key?: string;
};

type LinktreeSocialsProps = {
  socials?: SocialLink[];
  className?: string;
};

const iconMap: Record<string, IconType | typeof Mail> = {
  instagram: SiInstagram,
  linkedin: SiLinkedin,
  email: Mail,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  facebook: SiFacebook,
  x: SiX,
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
    },
  },
} as const;

const itemVariants = fadeInUpVariants({ y: 10, duration: 0.4 });

export default function LinktreeSocials({
  socials,
  className,
}: LinktreeSocialsProps) {
  const resolvedSocials = (socials ?? [])
    .filter((social) => social.href && social.icon)
    .slice(0, 6);

  if (!resolvedSocials.length) return null;

  return (
    <motion.div
      className={`flex items-center justify-center gap-5 sm:gap-6 ${className ?? ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {resolvedSocials.map((social) => {
        const Icon = iconMap[social.icon] ?? SiInstagram;
        const isEmail = social.icon === "email";
        const href = isEmail && !social.href.startsWith("mailto:")
          ? `mailto:${social.href}`
          : social.href;

        return (
          <motion.a
            key={social._key ?? social.icon}
            href={href}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noopener noreferrer"}
            aria-label={social.label || `Visit ${social.icon}`}
            variants={itemVariants}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center text-slate-800 transition-colors hover:text-slate-950"
          >
            <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
          </motion.a>
        );
      })}
    </motion.div>
  );
}
