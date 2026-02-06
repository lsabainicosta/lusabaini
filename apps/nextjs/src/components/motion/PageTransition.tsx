"use client";

import * as React from "react";
import { RouteTransitionProvider } from "@/components/motion/RouteTransitionContext";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function PageTransition({ children, className }: Props) {
  return (
    <div className={className}>
      <RouteTransitionProvider disableEnterAnimations={false}>
        {children}
      </RouteTransitionProvider>
    </div>
  );
}
