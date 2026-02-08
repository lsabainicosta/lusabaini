import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCanonicalHostname } from "@/lib/seo";

const WWW_PREFIX = "www.";

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const canonicalHostname = getCanonicalHostname();
  if (!canonicalHostname || canonicalHostname === "localhost") {
    return NextResponse.next();
  }

  const requestHostname = request.nextUrl.hostname.toLowerCase();
  const strippedHostname = requestHostname.startsWith(WWW_PREFIX)
    ? requestHostname.slice(WWW_PREFIX.length)
    : requestHostname;

  if (requestHostname.startsWith(WWW_PREFIX) && strippedHostname === canonicalHostname) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = canonicalHostname;
    redirectUrl.protocol = "https:";
    redirectUrl.port = "";
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
