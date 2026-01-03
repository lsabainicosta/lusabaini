"use client";

import * as React from "react";

type RouteTransitionState = {
  /**
   * True for pages that mount via client-side navigation (not the initial load).
   * Components can use this to skip their own entrance animations so the
   * page-level transition is the only "enter" animation.
   */
  disableEnterAnimations: boolean;
};

const RouteTransitionContext = React.createContext<RouteTransitionState>({
  disableEnterAnimations: false,
});

export function RouteTransitionProvider({
  disableEnterAnimations,
  children,
}: {
  disableEnterAnimations: boolean;
  children: React.ReactNode;
}) {
  return (
    <RouteTransitionContext.Provider value={{ disableEnterAnimations }}>
      {children}
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  return React.useContext(RouteTransitionContext);
}
