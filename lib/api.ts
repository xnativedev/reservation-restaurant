import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { APIError } from "better-auth/api";

export class HttpError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return; // Some clients don't send origin
  const trustedOrigins = [
    process.env.BETTER_AUTH_URL ? new URL(process.env.BETTER_AUTH_URL).origin : null,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null,
    "http://localhost:3000"
  ].filter(Boolean);

  if (!trustedOrigins.includes(origin)) {
    throw new HttpError(403, "INVALID_ORIGIN");
  }
}

export async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "JSON_REQUIRED");
  try { return await request.json(); }
  catch { throw new HttpError(400, "INVALID_INPUT"); }
}

export function apiError(error: unknown) {
  if (error instanceof HttpError) return NextResponse.json({ success: false, error: error.code }, { status: error.status });
  if (error instanceof ZodError) return NextResponse.json({ success: false, error: "INVALID_INPUT" }, { status: 400 });
  if (error instanceof APIError) return NextResponse.json({ success: false, error: error.body?.code || "AUTH_FAILED" }, { status: error.statusCode });
  if (error && typeof error === "object" && "code" in error && error.code === 11000) return NextResponse.json({ success: false, error: "ALREADY_EXISTS" }, { status: 409 });
  console.error("Request failed:", error instanceof Error ? error.name : "Unknown error");
  return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
}
