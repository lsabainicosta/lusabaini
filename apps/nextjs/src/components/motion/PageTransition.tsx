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

// Module-level flag that persists across route changes.
// Prevents the enter animation from running on initial page load/refresh
// (which causes a hydration shift), but still allows it on client-side navigation.
let hasInitialRenderCompleted = false;

export default function PageTransition({ children, className }: Props) {
  const pathname = usePathname();
  const { isExiting, exitFromPathname, exitDurationMs } =
    useTransitionNavigation();
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);

  // Capture whether this is the initial render before the effect runs
  const isInitialRender = !hasInitialRenderCompleted;

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
    hasInitialRenderCompleted = true;
  }, []);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const isExitingThisPage = isExiting && exitFromPathname === pathname;

  return (
    <motion.div
      key={pathname}
      className={className}
      // Skip enter animation on initial page load to prevent hydration shift.
      // `initial={false}` tells Framer Motion to start at the `animate` state.
      initial={isInitialRender ? false : { opacity: 0, y: FADE_IN_Y }}
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
