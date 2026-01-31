"use client";

import * as React from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { RouteTransitionProvider } from "@/components/motion/RouteTransitionContext";
import { useTransitionNavigation } from "@/components/motion/TransitionContext";
import { EASE_OUT } from "@/components/motion/fade";

type Props = {
  children: React.ReactNode;
  className?: string;
};

// Page transition specific values
const PAGE_ENTER_DURATION = 0.45;
const PAGE_TRANSITION_Y = 20;

// Module-level tracking that persists across route changes.
let hasInitialRenderCompleted = false;
let lastRenderedPathname: string | null = null;

export default function PageTransition({ children, className }: Props) {
  const pathname = usePathname();
  const { isExiting, exitFromPathname, exitDurationMs } =
    useTransitionNavigation();
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);
  
  // Check if this is a new page navigation (pathname changed)
  // Capture this before updating lastRenderedPathname
  const isNewPage = lastRenderedPathname !== null && lastRenderedPathname !== pathname;
  
  // Update tracking after capturing the check
  React.useEffect(() => {
    lastRenderedPathname = pathname;
  }, [pathname]);

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
    if (lastRenderedPathname === null) {
      lastRenderedPathname = pathname;
    }
  }, [pathname]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const isExitingThisPage = isExiting && exitFromPathname === pathname;
  
  // Determine if we should animate entry
  // Skip on initial page load, but animate on client-side navigation
  const shouldAnimateEntry = hasInitialRenderCompleted && isNewPage;

  return (
    <motion.div
      key={pathname}
      className={className}
      initial={shouldAnimateEntry ? { opacity: 0, y: PAGE_TRANSITION_Y } : false}
      animate={
        isExitingThisPage
          ? {
              opacity: 0,
              y: -PAGE_TRANSITION_Y,
              transition: {
                duration: exitDurationMs / 1000,
                ease: EASE_OUT,
              },
            }
          : {
              opacity: 1,
              y: 0,
              transition: {
                duration: shouldAnimateEntry ? PAGE_ENTER_DURATION : 0,
                ease: EASE_OUT,
              },
            }
      }
      style={{
        willChange: isExitingThisPage || shouldAnimateEntry ? "transform, opacity" : undefined,
        pointerEvents: isExitingThisPage ? "none" : undefined,
      }}
    >
      <RouteTransitionProvider disableEnterAnimations={hasMounted}>
        {children}
      </RouteTransitionProvider>
    </motion.div>
  );
}
