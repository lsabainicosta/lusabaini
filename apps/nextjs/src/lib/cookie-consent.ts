export const COOKIE_CONSENT_NAME = "lusabaini_cookie_consent";
export const COOKIE_CONSENT_EVENT = "lusabaini-cookie-consent-change";

export type CookieConsent = "accepted" | "rejected";

const CONSENT_VALUES: Record<CookieConsent, true> = {
  accepted: true,
  rejected: true,
};

const COOKIE_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

function escapeCookieName(name: string) {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseCookieConsent(value?: string | null): CookieConsent | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized in CONSENT_VALUES) {
    return normalized as CookieConsent;
  }
  return null;
}

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapeCookieName(name)}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function readCookieConsentFromDocument(): CookieConsent | null {
  return parseCookieConsent(readCookie(COOKIE_CONSENT_NAME));
}

export function persistCookieConsent(consent: CookieConsent) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${COOKIE_CONSENT_NAME}=${consent}; path=/; max-age=${COOKIE_CONSENT_MAX_AGE_SECONDS}; samesite=lax${secure}`;
}

export function subscribeToCookieConsent(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(COOKIE_CONSENT_EVENT, onStoreChange);
  return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onStoreChange);
}
