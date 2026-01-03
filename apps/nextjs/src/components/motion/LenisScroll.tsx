"use client";

import * as React from "react";
import Lenis from "lenis";

type Props = {
  /**
   * Lower = slower on trackpads/wheels. Keep between ~0.6 and 1.0.
   */
  wheelMultiplier?: number;
};

export default function LenisScroll({ wheelMultiplier = 0.75 }: Props) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      wheelMultiplier,
      // A small lerp gives a "nice" smoothness without feeling laggy.
      lerp: 0.08,
    });

    return () => {
      lenis.destroy();
    };
  }, [prefersReducedMotion, wheelMultiplier]);

  return null;
}
