import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

const expectedSecret = process.env.REVALIDATE_SECRET;

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Unauthorized" },
    { status: 401 }
  );
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-revalidate-secret",
};

export async function POST(request: NextRequest) {
  console.log("REVALIDATING");

  if (!expectedSecret) {
    console.log("Server missing REVALIDATE_SECRET");
    return NextResponse.json(
      { ok: false, error: "Server missing REVALIDATE_SECRET" },
      { status: 500, headers: corsHeaders }
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret");

  console.log("Provided secret:", provided, "Expected secret:", expectedSecret);
  if (provided !== expectedSecret) {
    console.log("Provided secret does not match expected secret");
    return unauthorized();
  }

  console.log("Provided secret matches expected secret, revalidating...");

  // Invalidate all relevant cached tags
  const tagsToRevalidate = [
    "homepage-content",
    "shell-content",
    "home-sections",
    "theme-settings",
    "client-results",
    "about-page",
    "my-work-page",
  ];

  tagsToRevalidate.forEach((tag) => {
    revalidateTag(tag, "max");
  });

  return NextResponse.json(
    {
      ok: true,
      revalidated: tagsToRevalidate,
    },
    { headers: corsHeaders }
  );
}

export async function GET(request: NextRequest) {
  // Allow GET for simple webhook testing (e.g., curl in a browser), still protected by secret.
  const response = await POST(request);
  response.headers.set(
    "Access-Control-Allow-Origin",
    corsHeaders["Access-Control-Allow-Origin"]
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    corsHeaders["Access-Control-Allow-Methods"]
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    corsHeaders["Access-Control-Allow-Headers"]
  );
  return response;
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}
