"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";

type BrandItem = {
  name?: string;
  href?: string;
  image?: { url?: string; alt?: string };
};

type Props = {
  introText?: string;
  logos?: BrandItem[];
};

const defaultBrands: Array<{
  name: string;
  prefix?: string;
  className: string;
}> = [
  { name: "ore.", className: "font-serif" },
  { name: "ther", className: "font-mono italic" },
  { name: "Amsterdam", prefix: "○", className: "font-sans" },
  {
    name: "MILANO",
    prefix: "M ",
    className: "font-sans tracking-widest bg-gray-200 px-1",
  },
  { name: "venice.", className: "font-serif lowercase" },
  { name: "ther", className: "font-mono italic" },
  { name: "Amsterdam", prefix: "○", className: "font-sans" },
];

const BrandLogos = ({ introText, logos }: Props) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const [rowWidth, setRowWidth] = React.useState(0);
  const rowRef = React.useRef<HTMLDivElement | null>(null);

  const hasAnyImages = (logos ?? []).some((l) => l.image?.url);
  const imageLogos = (logos ?? []).filter((l) => l.image?.url);
  const brands = defaultBrands;

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const update = () => setPrefersReducedMotion(mq.matches);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  React.useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const measure = () => setRowWidth(el.scrollWidth);
    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasAnyImages, imageLogos.length]);

  // Pixel-perfect infinite marquee: we translate by exactly one "row" width and wrap.
  const x = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion) return;
    if (!rowWidth) return;
    // One full loop every 20s (matches previous duration).
    const speedPxPerMs = rowWidth / 20000;
    let next = x.get() - speedPxPerMs * delta;
    // Wrap seamlessly into the range (-rowWidth, 0] without snapping.
    if (next <= -rowWidth) {
      next = (((next % rowWidth) + rowWidth) % rowWidth) - rowWidth;
    }
    x.set(next);
  });

  const Row = React.useMemo(() => {
    if (hasAnyImages) {
      return (
        <>
          {imageLogos.map((logo, i) => (
            <div
              key={`${logo.image?.url ?? "logo"}-${i}`}
              className="shrink-0"
              aria-label={logo.name || logo.image?.alt || "Brand logo"}
            >
              {logo.href ? (
                <Link href={logo.href} className="block shrink-0">
                  <div className="relative h-10 w-[140px]">
                    <Image
                      src={logo.image?.url || ""}
                      alt={logo.image?.alt || logo.name || "Brand logo"}
                      fill
                      className="object-contain"
                      sizes="140px"
                    />
                  </div>
                </Link>
              ) : (
                <div className="relative h-10 w-[140px]">
                  <Image
                    src={logo.image?.url || ""}
                    alt={logo.image?.alt || logo.name || "Brand logo"}
                    fill
                    className="object-contain"
                    sizes="140px"
                  />
                </div>
              )}
            </div>
          ))}
        </>
      );
    }

    return (
      <>
        {brands.map((brand, i) => (
          <div
            key={i}
            className={`text-2xl font-medium text-black flex items-center gap-2 ${brand.className} shrink-0`}
          >
            {brand.prefix && <span className="text-xl">{brand.prefix}</span>}
            {brand.name}
          </div>
        ))}
      </>
    );
  }, [brands, hasAnyImages, imageLogos]);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <p className="text-sm text-black/40 font-sans max-w-[140px] leading-tight shrink-0">
          {introText || "Brands I have helped grow on social."}
        </p>
        <div
          className="relative flex-1 overflow-hidden opacity-40 grayscale"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <motion.div
            className="flex items-center gap-x-20 whitespace-nowrap py-2 w-max"
            style={{
              x: prefersReducedMotion ? 0 : x,
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            <div ref={rowRef} className="flex items-center gap-x-20">
              {Row}
            </div>
            <div aria-hidden="true" className="flex items-center gap-x-20">
              {Row}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrandLogos;
