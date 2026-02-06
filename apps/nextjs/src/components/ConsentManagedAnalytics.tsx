"use client";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { useSyncExternalStore } from "react";
import {
  readCookieConsentFromDocument,
  subscribeToCookieConsent,
} from "@/lib/cookie-consent";

export default function ConsentManagedAnalytics() {
  const consent = useSyncExternalStore(
    subscribeToCookieConsent,
    readCookieConsentFromDocument,
    () => "rejected"
  );
  const enabled = consent === "accepted";

  if (!enabled) return null;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  );
}
