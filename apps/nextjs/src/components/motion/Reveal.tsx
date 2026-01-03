"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import { FADE_IN_DELAY, fadeInUpVariants } from "@/components/motion/fade";

type Props = {
  children: React.ReactNode;
  className?: string;
  /**
   * Delay in seconds.
   */
  delay?: number;
  /**
   * Distance (px) to start from.
   */
  y?: number;
  /**
   * Reveal only once.
   */
  once?: boolean;
  /**
   * How much of the element should be in view before revealing (0..1).
   */
  amount?: number;
};

export default function Reveal({
  children,
  className,
  delay = FADE_IN_DELAY,
  y = 28,
  once = true,
  amount = 0.7,
}: Props) {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const { disableEnterAnimations } = useRouteTransition();
  const [disableEnterAnimationsAtMount] = React.useState(
    () => disableEnterAnimations
  );

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const update = () => setPrefersReducedMotion(mq.matches);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Avoid "double animations" on client-side navigation: let the page-level
  // transition handle the entrance.
  if (prefersReducedMotion || disableEnterAnimationsAtMount) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={fadeInUpVariants({ y, delay })}
    >
      {children}
    </motion.div>
  );
}
