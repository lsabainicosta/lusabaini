import "server-only";
import nodemailer from "nodemailer";
import { DEFAULT_BRAND_COLOR } from "@lusabaini/ui/lib/brand";
import { getThemeSettings } from "@/lib/queries";
import { buildCanonicalUrl } from "@/lib/seo";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const mailFrom =
  process.env.SMTP_FROM || `"Consultoria Contato" <${process.env.SMTP_USER}>`;

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const INK = "#1a1a1a";
const MUTED = "#6b6b6b";

/** Plain paragraphs -> text part + escaped HTML paragraphs, bare URLs become links. */
export function paragraphs(items: string[]) {
  return {
    text: items.join("\n\n"),
    html: items
      .map(
        (p) =>
          `<p style="margin: 0 0 16px;">${escapeHtml(p)
            .replace(/(https?:\/\/[^\s<]+)/g, `<a href="$1" style="color: ${INK};">$1</a>`)
            .replace(/\n/g, "<br />")}</p>`
      )
      .join(""),
  };
}

/**
 * The one email layout for the site: brand-colored background, "ls" logo, white card.
 * Text and inline styles only (no images or big buttons), which keeps it out of spam.
 * `title` is escaped here; `bodyHtml` must already be escaped by the caller.
 */
export async function emailLayout(title: string, bodyHtml: string) {
  const theme = await getThemeSettings().catch(() => null);
  const raw = theme?.brandColor ?? "";
  // The color comes from the CMS and lands in a style attribute, so only allow a hex value.
  const brand = /^#[0-9a-fA-F]{6}$/.test(raw) ? raw : DEFAULT_BRAND_COLOR;
  const siteUrl = buildCanonicalUrl("/");
  const siteLabel = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin: 0; padding: 0; background: ${brand};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${brand}; padding: 32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; font-family: Helvetica, Arial, sans-serif; color: ${INK}; font-size: 15px; line-height: 1.6;">
        <tr><td style="padding: 0 4px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="width: 36px; height: 36px; border-radius: 18px; background: ${INK}; color: ${brand}; text-align: center; font-family: Georgia, serif; font-style: italic; font-size: 17px; line-height: 36px;">ls</td>
            <td style="padding-left: 10px; line-height: 1.1;">
              <div style="font-size: 18px; font-weight: 500; letter-spacing: -0.5px;">luiza sabaini</div>
              <div style="font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED};">consultoria holanda</div>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="background: #ffffff; border-radius: 16px; padding: 32px;">
          <h1 style="margin: 0 0 20px; padding-bottom: 14px; border-bottom: 1px solid #eeeeee; font-size: 22px; font-weight: 500; letter-spacing: -0.3px;">${escapeHtml(title)}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding: 20px 4px 0; font-size: 12px; color: ${MUTED};">
          Luiza Sabaini Costa · Consultoria Holanda · <a href="${siteUrl}" style="color: ${MUTED};">${escapeHtml(siteLabel)}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
