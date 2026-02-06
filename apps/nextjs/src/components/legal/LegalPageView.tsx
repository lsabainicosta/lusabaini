import { Badge } from "@/components/ui/badge";
import { marked } from "marked";
import type { LegalPageContent } from "@/lib/queries";

type Props = {
  page: LegalPageContent;
};

function normalizeMarkdownContent(raw?: unknown) {
  if (!raw) return "";

  let normalized: string;
  if (typeof raw === "string") {
    normalized = raw;
  } else if (typeof raw === "object" && raw !== null) {
    const candidate =
      "markdown" in raw && typeof raw.markdown === "string"
        ? raw.markdown
        : "content" in raw && typeof raw.content === "string"
          ? raw.content
          : "value" in raw && typeof raw.value === "string"
            ? raw.value
            : "";
    normalized = candidate;
  } else {
    normalized = String(raw);
  }

  const trimmed = normalized.trim();

  // Handle cases where markdown was stored/returned as a JSON-stringified string.
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[")
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "string") {
        normalized = parsed;
      }
    } catch {
      // Keep original string when it's not valid JSON.
    }
  }

  // Convert escaped newlines/tabs into actual whitespace so markdown can parse.
  if (!normalized.includes("\n") && /\\[nrt]/.test(normalized)) {
    normalized = normalized
      .replace(/\\r\\n/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\n")
      .replace(/\\t/g, "\t");
  }

  return normalized;
}

function hasMarkdownSyntax(value: string) {
  return /(^|\n)\s{0,3}(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|```|\[[^\]]+\]\([^)]+\))/.test(
    value
  );
}

function isLikelySectionHeading(line: string) {
  const compact = line.trim();
  if (!compact) return false;
  if (compact.length > 58) return false;
  if (/[.!?:]$/.test(compact)) return false;

  return /^(cookies?|cookie|privacy|analytics|information|managing|changes|contact|retention|rights|lawful basis|legal basis)/i.test(
    compact
  );
}

function isLikelyListIntro(line: string) {
  return /(including|includes|may collect|such as|for example)\s*:?\s*$/i.test(
    line.trim()
  );
}

function isLikelyListItem(line: string) {
  const compact = line.trim();
  if (!compact) return false;
  if (compact.length > 50) return false;
  if (/[.!?]$/.test(compact)) return false;
  return true;
}

function coercePlainLegalTextToMarkdown(value: string) {
  if (hasMarkdownSyntax(value)) return value;

  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 6) return value;

  const out: string[] = [];
  let paragraph: string[] = [];
  let listMode = false;
  let previousWasListIntro = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    out.push(paragraph.join(" "));
    out.push("");
    paragraph = [];
  };

  for (const line of lines) {
    if (isLikelySectionHeading(line)) {
      flushParagraph();
      listMode = false;
      previousWasListIntro = false;
      out.push(`## ${line}`);
      out.push("");
      continue;
    }

    if (
      (previousWasListIntro && isLikelyListItem(line)) ||
      (listMode && isLikelyListItem(line))
    ) {
      flushParagraph();
      out.push(`- ${line}`);
      listMode = true;
      previousWasListIntro = false;
      continue;
    }

    if (listMode) {
      out.push("");
      listMode = false;
    }

    paragraph.push(line);
    previousWasListIntro = isLikelyListIntro(line);

    if (/[.!?:]$/.test(line)) {
      flushParagraph();
    }
  }

  if (listMode) out.push("");
  flushParagraph();

  return out.join("\n").trim();
}

function formatLastUpdated(raw?: string) {
  if (!raw?.trim()) return "";
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  }).format(parsed);
}

export default function LegalPageView({ page }: Props) {
  const lastUpdated = formatLastUpdated(page.lastUpdated);
  const normalizedContent = normalizeMarkdownContent(page.content);
  const parsedContent = coercePlainLegalTextToMarkdown(normalizedContent);

  const contentHtml = marked.parse(parsedContent, {
    gfm: true,
    breaks: true,
  }) as string;

  return (
    <section className="w-full pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative">
          <div className="max-w-3xl flex flex-col gap-10">
            <div className="flex flex-col items-start gap-8">
              <Badge className="px-4 py-1 bg-black/5 rounded-lg text-xs font-semibold uppercase tracking-wider text-black/60 border-transparent">
                {page.badgeLabel || "Legal"}
              </Badge>

              <div className="flex flex-col gap-4">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
                  {page.headlineStart}{" "}
                  {page.headlineEmphasis ? (
                    <span className="italic font-serif">{page.headlineEmphasis}</span>
                  ) : null}
                  {page.headlineEnd ? ` ${page.headlineEnd}` : ""}
                </h1>

                {lastUpdated ? (
                  <p className="text-xl text-black/60 font-sans leading-relaxed">
                    Last updated: {lastUpdated}
                  </p>
                ) : null}

                {page.description?.trim() ? (
                  <p className="text-xl text-black/60 font-sans leading-relaxed">
                    {page.description}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2.5rem] border-4 border-white bg-white/70 p-4 sm:p-6 shadow-2xl">
              <div className="relative overflow-hidden">
                <div
                  className="text-base sm:text-lg text-black/70 font-sans leading-relaxed
                    [&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:font-medium [&_h1]:tracking-[-0.03em] [&_h1]:text-black [&_h1]:mt-8 [&_h1]:mb-4
                    [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-medium [&_h2]:tracking-[-0.03em] [&_h2]:text-black [&_h2]:mt-8 [&_h2]:mb-3
                    [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-medium [&_h3]:tracking-[-0.03em] [&_h3]:text-black [&_h3]:mt-7 [&_h3]:mb-3
                    [&_p]:mb-4
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:mb-4
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:mb-4
                    [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:opacity-80 [&_a]:transition-opacity"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </div>
            </div>
          </div>

          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-(--brand-dark)/10 blur-[120px] rounded-full" />
        </div>
      </div>
    </section>
  );
}
