import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

const expectedSecret = process.env.REVALIDATE_SECRET;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-revalidate-secret",
};

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Unauthorized" },
    { status: 401, headers: corsHeaders }
  );
}

export async function POST(request: NextRequest) {
  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, error: "Server missing REVALIDATE_SECRET" },
      { status: 500, headers: corsHeaders }
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret");

  if (provided !== expectedSecret) {
    return unauthorized();
  }

  const tagsToRevalidate = [
    "shell-content",
    "home-sections",
    "theme-settings",
    "services-page",
    "about-page",
    "contact-page",
    "guides",
  ];

  tagsToRevalidate.forEach((tag) => {
    revalidateTag(tag, "max");
  });

  return NextResponse.json(
    { ok: true, revalidated: tagsToRevalidate },
    { headers: corsHeaders }
  );
}

export async function GET(request: NextRequest) {
  const response = await POST(request);
  Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}
