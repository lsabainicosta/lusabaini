"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import { EASE_OUT } from "@/components/motion/fade";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  amount?: number;
  stagger?: number;
  delayChildren?: number;
};

export function Stagger({
  children,
  className,
  once = true,
  amount = 0.2,
  stagger = 0.1,
  delayChildren = 0,
}: StaggerProps) {
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
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren,
            duration: 0.4,
            ease: EASE_OUT,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  y?: number;
  duration?: number;
};

// Smooth fade-in-up variants for stagger items
function smoothFadeInUpVariants(y: number, duration: number) {
  return {
    hidden: { 
      opacity: 0, 
      y,
      filter: "blur(2px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { 
        duration, 
        ease: EASE_OUT,
      },
    },
  };
}

export function StaggerItem({ 
  children, 
  className, 
  y = 20,
  duration = 0.75,
}: StaggerItemProps) {
  return (
    <motion.div 
      className={className} 
      variants={smoothFadeInUpVariants(y, duration)}
    >
      {children}
    </motion.div>
  );
}
