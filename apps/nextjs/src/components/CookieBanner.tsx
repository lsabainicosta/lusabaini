"use client";

import { useSyncExternalStore } from "react";
import {
  COOKIE_CONSENT_EVENT,
  persistCookieConsent,
  readCookieConsentFromDocument,
  subscribeToCookieConsent,
} from "@/lib/cookie-consent";
import TransitionLink from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/button";

type Props = {
  policyHref?: string;
};

export default function CookieBanner({ policyHref = "/legal/cookie-policy" }: Props) {
  const consent = useSyncExternalStore(
    subscribeToCookieConsent,
    readCookieConsentFromDocument,
    () => "accepted"
  );

  const handleChoice = (consent: "accepted" | "rejected") => {
    persistCookieConsent(consent);
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  };

  const visible = consent === null;
  if (!visible) return null;

  return (
    <section
      aria-live="polite"
      className="fixed z-[70] flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300"
      style={{
        left: "calc(env(safe-area-inset-left) + 1rem)",
        right: "calc(env(safe-area-inset-right) + 1rem)",
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="pointer-events-auto w-full max-w-2xl rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl shadow-[0_28px_80px_-35px_rgba(0,0,0,0.55)]">
        <div className="flex items-start gap-3 p-4 sm:p-5">
          <div className="w-full">
            <p className="text-sm sm:text-[15px] leading-relaxed text-black/80">
              We only use analytics cookies to understand site usage and improve the
              experience. No advertising or cross-site tracking.
            </p>

            <div className="mt-4 sm:mt-5 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="order-1 flex items-center justify-center gap-3 sm:order-2 sm:ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleChoice("rejected")}
                  className="px-4 text-black/75 hover:text-black"
                >
                  Only necessary
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleChoice("accepted")}
                  className="px-4"
                >
                  Accept all
                </Button>
              </div>
              <div className="order-2 text-center sm:order-1 sm:text-left">
                <TransitionLink
                  href={policyHref}
                  className="text-xs sm:text-sm font-medium text-black/65 underline underline-offset-4 hover:text-black"
                >
                  Read cookie policy
                </TransitionLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
