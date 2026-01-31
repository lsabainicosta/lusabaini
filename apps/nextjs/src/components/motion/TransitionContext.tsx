"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

type TransitionContextValue = {
  isExiting: boolean;
  exitFromPathname: string | null;
  exitToHref: string | null;
  exitDurationMs: number;
  navigate: (href: string) => void;
};

const TransitionContext = React.createContext<TransitionContextValue | null>(
  null
);

function normalizePath(href: string) {
  return href.split("#")[0] || href;
}

export function TransitionProvider({
  children,
  exitDurationMs = 280,
}: {
  children: React.ReactNode;
  exitDurationMs?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isExiting, setIsExiting] = React.useState(false);
  const [exitFromPathname, setExitFromPathname] = React.useState<string | null>(
    null
  );
  const [exitToHref, setExitToHref] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    // Route has changed. Clear exit state only once we've actually navigated
    // away from the page that started the exit (prevents "snap back" stutter).
    if (isExiting && exitFromPathname && pathname !== exitFromPathname) {
      setIsExiting(false);
      setExitFromPathname(null);
      setExitToHref(null);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [exitFromPathname, isExiting, pathname]);

  const navigate = React.useCallback(
    (href: string) => {
      const to = normalizePath(href);
      const from = normalizePath(pathname);

      // Start prefetch ASAP so the next route is ready by the time the exit finishes.
      if (to.startsWith("/")) {
        try {
          router.prefetch(to);
        } catch {
          // ignore
        }
      }

      // Same page navigation (or hash only) should not trigger a full transition.
      if (!to.startsWith("/") || to === from) {
        router.push(href);
        return;
      }

      if (isExiting) return;

      setExitFromPathname(pathname);
      setExitToHref(href);
      setIsExiting(true);

      timeoutRef.current = window.setTimeout(() => {
        router.push(href);
      }, exitDurationMs);
    },
    [exitDurationMs, isExiting, pathname, router]
  );

  return (
    <TransitionContext.Provider
      value={{
        isExiting,
        exitFromPathname,
        exitToHref,
        exitDurationMs,
        navigate,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionNavigation() {
  const ctx = React.useContext(TransitionContext);
  // Return a fallback when outside provider (e.g., during static prerendering of not-found page)
  if (!ctx) {
    return {
      isExiting: false,
      exitFromPathname: null,
      exitToHref: null,
      exitDurationMs: 280,
      navigate: null, // Signal that transition navigation is unavailable
    } as const;
  }
  return ctx;
}
