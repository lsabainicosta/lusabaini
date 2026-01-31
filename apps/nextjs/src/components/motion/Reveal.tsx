"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import { EASE_OUT } from "@/components/motion/fade";

type Props = {
  children: React.ReactNode;
  className?: string;
  /**
   * Delay in seconds.
   */
  delay?: number;
  /**
   * Duration in seconds.
   */
  duration?: number;
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

// Smooth fade-in-up variants with subtle blur
function smoothRevealVariants(y: number, duration: number, delay: number) {
  return {
    hidden: { 
      opacity: 0, 
      y,
      filter: "blur(3px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration, 
        ease: EASE_OUT, 
        delay,
      },
    },
  };
}

export default function Reveal({
  children,
  className,
  delay = 0.05,
  duration = 0.85,
  y = 24,
  once = true,
  amount = 0.5,
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
      variants={smoothRevealVariants(y, duration, delay)}
    >
      {children}
    </motion.div>
  );
}
