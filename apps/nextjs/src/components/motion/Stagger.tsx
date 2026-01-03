"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useRouteTransition } from "@/components/motion/RouteTransitionContext";
import { fadeInUpVariants } from "@/components/motion/fade";

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
  stagger = 0.08,
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
        hidden: {},
        show: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
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
};

export function StaggerItem({ children, className, y = 18 }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={fadeInUpVariants({ y })}>
      {children}
    </motion.div>
  );
}
