"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTransitionNavigation } from "@/components/motion/TransitionContext";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function TransitionShell({ children, className }: Props) {
  const { isExiting, exitDurationMs } = useTransitionNavigation();

  return (
    <div
      className={cn(
        "transition-opacity ease-out motion-reduce:transition-none",
        isExiting
          ? "opacity-0"
          : "opacity-100",
        className
      )}
      style={{ transitionDuration: `${exitDurationMs}ms` }}
    >
      {children}
    </div>
  );
}
