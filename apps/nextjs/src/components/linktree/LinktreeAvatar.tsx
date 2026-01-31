"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { sanityImageLoader } from "@/lib/sanityImageLoader";
import { fadeInVariants } from "@/components/motion/fade";

type LinktreeAvatarProps = {
  image?: {
    url?: string;
    alt?: string;
  };
  name?: string;
};

export default function LinktreeAvatar({ image, name }: LinktreeAvatarProps) {
  if (!image?.url) return null;

  const alt = image.alt || name || "Profile";

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeInVariants({ duration: 0.6 })}
      className="relative"
    >
      <div
        className="relative h-24 w-24 overflow-hidden rounded-full ring-1 shadow-lg sm:h-28 sm:w-28"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        }}
      >
        <Image
          loader={sanityImageLoader}
          src={image.url}
          alt={alt}
          fill
          priority
          sizes="112px"
          className="object-cover"
        />
      </div>
      {/* Decorative ring using brand color */}
      <div className="absolute inset-0 rounded-full ring-1 ring-offset-2 ring-offset-transparent" />
    </motion.div>
  );
}
