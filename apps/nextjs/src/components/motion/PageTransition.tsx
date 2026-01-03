"use client";

import * as React from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { RouteTransitionProvider } from "@/components/motion/RouteTransitionContext";
import { useTransitionNavigation } from "@/components/motion/TransitionContext";
import {
  EASE_OUT,
  FADE_IN_DURATION,
  FADE_IN_Y,
} from "@/components/motion/fade";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function PageTransition({ children, className }: Props) {
  const pathname = usePathname();
  const { isExiting, exitFromPathname, exitDurationMs } =
    useTransitionNavigation();
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const update = () => setPrefersReducedMotion(mq.matches);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const isExitingThisPage = isExiting && exitFromPathname === pathname;

  return (
    <motion.div
      key={pathname}
      className={className}
      initial={{ opacity: 0, y: FADE_IN_Y }}
      animate={
        isExitingThisPage
          ? {
              opacity: 0,
              y: -FADE_IN_Y,
              transition: {
                duration: exitDurationMs / 1000,
                ease: EASE_OUT,
              },
            }
          : {
              opacity: 1,
              y: 0,
              transition: { duration: FADE_IN_DURATION, ease: EASE_OUT },
            }
      }
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)",
        pointerEvents: isExitingThisPage ? "none" : undefined,
      }}
    >
      <RouteTransitionProvider disableEnterAnimations={hasMounted}>
        {children}
      </RouteTransitionProvider>
    </motion.div>
  );
}
