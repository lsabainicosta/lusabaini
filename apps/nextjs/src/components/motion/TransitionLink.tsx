"use client";

import * as React from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useTransitionNavigation } from "@/components/motion/TransitionContext";

type Props = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: React.ReactNode;
  };

function isModifiedEvent(e: React.MouseEvent<HTMLAnchorElement>) {
  return e.metaKey || e.altKey || e.ctrlKey || e.shiftKey;
}

function shouldInterceptHref(href: unknown) {
  if (typeof href !== "string") return false;
  if (!href.startsWith("/")) return false; // external, hash, mailto, etc.
  return true;
}

export default function TransitionLink({
  href,
  onClick,
  target,
  children,
  ...rest
}: Props) {
  const { navigate } = useTransitionNavigation();
  const router = useRouter();

  const maybePrefetch = React.useCallback(() => {
    if (!shouldInterceptHref(href)) return;
    try {
      router.prefetch(href as string);
    } catch {
      // ignore
    }
  }, [href, router]);

  return (
    <Link
      href={href}
      target={target}
      {...rest}
      onMouseEnter={(e) => {
        rest.onMouseEnter?.(e);
        if (target === "_blank") return;
        maybePrefetch();
      }}
      onFocus={(e) => {
        rest.onFocus?.(e);
        if (target === "_blank") return;
        maybePrefetch();
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (target === "_blank") return;
        if (isModifiedEvent(e)) return;

        // When navigate is null (outside TransitionProvider), use default Link behavior
        if (navigate && shouldInterceptHref(href)) {
          e.preventDefault();
          navigate(href as string);
        }
      }}
    >
      {children}
    </Link>
  );
}
