"use client";

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const FADE_IN_Y = 28;
export const FADE_IN_DURATION = 0.85;
export const FADE_IN_DELAY = 0.08;

export type FadeInUpOptions = {
  y?: number;
  duration?: number;
  delay?: number;
};

export function fadeInUpVariants({
  y = FADE_IN_Y,
  duration = FADE_IN_DURATION,
  delay = 0,
}: FadeInUpOptions = {}) {
  return {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: EASE_OUT, delay },
    },
  } as const;
}

export function fadeInVariants({
  duration = FADE_IN_DURATION,
  delay = 0,
}: Omit<FadeInUpOptions, "y"> = {}) {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration, ease: EASE_OUT, delay },
    },
  } as const;
}
