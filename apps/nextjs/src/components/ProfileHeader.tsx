"use client";
import { useCallback, useEffect, useState, type ComponentType } from "react";
import { motion } from "motion/react";
import { BadgeCheck, Instagram, Mail, Music2, Share } from "lucide-react";
import Image from "next/image";
import { sanityImageLoader } from "../lib/sanityImageLoader";

type HeaderButton = {
  label: string;
  href: string;
  icon?: string;
  _key?: string;
};

type ProfileImage = {
  url?: string;
  alt?: string;
};

const iconMap: Record<
  string,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  mail: Mail,
  tiktok: Music2,
  instagram: Instagram,
  share: Share,
};

export default function ProfileHeader({
  name,
  image,
  buttons,
}: {
  name?: string;
  image?: ProfileImage;
  buttons?: HeaderButton[];
}) {
  const resolvedButtons = (buttons ?? []).filter(
    (button) => button.href && button.label
  );

  const hasContent =
    (name && name.trim().length > 0) ||
    (image && image.url) ||
    resolvedButtons.length > 0;

  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        setShareUrl(window.location.href);
      }, 100);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const handleShare = useCallback(async () => {
    const url =
      shareUrl || (typeof window !== "undefined" ? window.location.href : "");

    if (!url) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: name ?? "Check out this page",
          url,
        });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        window?.alert?.("Link copied to clipboard");
        return;
      } catch {
        // no-op, fall back below
      }
    }

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, [name, shareUrl]);

  if (!hasContent) return null;

  const imageAlt = image?.alt || name || "Profile image";

  return (
    <section className="w-full">
      <div
        className="relative mx-auto flex aspect-3/4 w-full max-w-5xl flex-col justify-end overflow-hidden rounded-none shadow-none md:aspect-16/7 md:min-h-[520px] md:rounded-[34px] md:shadow-[0_25px_80px_rgba(255,126,219,0.25)] lg:max-w-6xl"
        style={{ backgroundColor: "var(--brand-soft, #fff0f7)" }}
      >
        <motion.button
          initial={{ opacity: 0, x: 18 }} // slide in from the right
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.08,
            type: "spring",
            stiffness: 140,
            damping: 18,
          }}
          type="button"
          onClick={handleShare}
          aria-label="Share this page"
          className="absolute top-5 right-5 z-10 rounded-full bg-white/50 p-2 shadow-md backdrop-blur transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:top-7 md:right-7 md:bg-white/60"
        >
          <Share className="w-4 h-4 md:h-5 md:w-5" />
        </motion.button>

        {image?.url ? (
          <motion.div
            initial={{ scale: 1.02, opacity: 0.2 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              loader={sanityImageLoader}
              src={image.url}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 1280px) 65vw, (min-width: 768px) 90vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        ) : null}

        <div
          className="pointer-events-none absolute inset-x-0 -bottom-2 h-72 md:h-88"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--brand-color, #ff7edb) 55%, transparent) 40%, color-mix(in srgb, var(--brand-color, #ff7edb) 28%, var(--brand-soft, #fff0f7) 72%) 90%, var(--brand-soft, #fff0f7) 100%)",
          }}
        />

        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
          className="relative z-10 flex w-full flex-col gap-4 px-5 pb-10 text-center sm:px-8 sm:pb-12 md:flex-row md:items-end md:justify-between md:gap-6 md:px-12 md:pb-12 md:text-left lg:px-16 lg:pb-14"
        >
          {name ? (
            <div className="flex flex-col items-center md:items-start md:max-w-[65%]">
              <div className="flex relative items-center gap-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-[34px] md:text-4xl lg:text-[42px]">
                <span>{name}</span>
                <BadgeCheck
                  aria-label="Verified account"
                  className="absolute right-[-28px] top-[-10px] h-5 w-5 text-indigo-500 md:right-[-34px] md:top-[-12px] md:h-6 md:w-6"
                />
              </div>
            </div>
          ) : null}

          {resolvedButtons.length ? (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:justify-end md:gap-3.5 lg:gap-4">
              {resolvedButtons.map((item) => {
                const Icon = iconMap[item.icon ?? ""] ?? Share;
                return (
                  <a
                    key={item._key ?? item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-11 w-11 items-center justify-center text-slate-900 transition hover:-translate-y-0.5 sm:h-12 sm:w-12"
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                  </a>
                );
              })}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
