"use client";

// Smooth easing curve for polished animations
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Slightly different ease for scale animations
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const FADE_IN_Y = 24;
export const FADE_IN_DURATION = 0.9;
export const FADE_IN_DELAY = 0.06;

export type FadeInUpOptions = {
  y?: number;
  duration?: number;
  delay?: number;
  blur?: boolean;
};

export function fadeInUpVariants({
  y = FADE_IN_Y,
  duration = FADE_IN_DURATION,
  delay = 0,
  blur = false,
}: FadeInUpOptions = {}) {
  return {
    hidden: { 
      opacity: 0, 
      y,
      ...(blur && { filter: "blur(3px)" }),
    },
    show: {
      opacity: 1,
      y: 0,
      ...(blur && { filter: "blur(0px)" }),
      transition: { duration, ease: EASE_OUT, delay },
    },
  } as const;
}

export function fadeInVariants({
  duration = FADE_IN_DURATION,
  delay = 0,
}: Omit<FadeInUpOptions, "y" | "blur"> = {}) {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration, ease: EASE_OUT, delay },
    },
  } as const;
}

// Smooth fade with subtle blur for premium feel
export function fadeInBlurVariants({
  duration = FADE_IN_DURATION,
  delay = 0,
}: Omit<FadeInUpOptions, "y" | "blur"> = {}) {
  return {
    hidden: { 
      opacity: 0,
      filter: "blur(4px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration, ease: EASE_OUT, delay },
    },
  } as const;
}

// Scale + fade for cards and images
export function fadeInScaleVariants({
  scale = 0.96,
  duration = 0.9,
  delay = 0,
}: { scale?: number; duration?: number; delay?: number } = {}) {
  return {
    hidden: { 
      opacity: 0, 
      scale,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration, ease: EASE_OUT_EXPO, delay },
    },
  } as const;
}
