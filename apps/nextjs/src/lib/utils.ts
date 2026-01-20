import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Builds a mailto URL with optional subject and body parameters.
 * If the href is already a mailto link, it preserves the email address and adds/updates parameters.
 * If subject or body are provided, they are URL-encoded and added as query parameters.
 * Uses encodeURIComponent for proper encoding that email clients can decode correctly.
 */
export function buildMailtoUrl(
  href: string,
  subject?: string,
  body?: string
): string {
  // If it's not a mailto link, return as-is
  if (!href.startsWith("mailto:")) {
    return href;
  }

  // Extract email address (everything after mailto: and before ?)
  const emailMatch = href.match(/^mailto:([^?]+)/);
  if (!emailMatch) {
    return href;
  }

  const email = emailMatch[1];
  const params: string[] = [];

  // Parse existing query parameters if any (preserve non-subject/body params)
  const queryMatch = href.match(/\?(.+)$/);
  if (queryMatch) {
    const existingParams = new URLSearchParams(queryMatch[1]);
    for (const [key, value] of existingParams.entries()) {
      if (key !== "subject" && key !== "body") {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }

  // Add or override subject if provided
  if (subject?.trim()) {
    params.push(`subject=${encodeURIComponent(subject.trim())}`);
  }

  // Add or override body if provided
  if (body?.trim()) {
    params.push(`body=${encodeURIComponent(body.trim())}`);
  }

  // Build the final mailto URL
  const queryString = params.join("&");
  return queryString ? `mailto:${email}?${queryString}` : `mailto:${email}`;
}