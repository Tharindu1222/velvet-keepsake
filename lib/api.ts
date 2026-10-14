import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(
  message: string,
  status: number,
  extra?: Record<string, unknown>
) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function handleRouteError(err: unknown, fallback = "Request failed") {
  if (err instanceof ZodError) {
    return jsonError("Validation failed", 422, {
      issues: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  const code =
    typeof err === "object" && err && "code" in err
      ? String((err as { code: unknown }).code)
      : "";

  if (code === "ER_DUP_ENTRY") {
    return jsonError("Duplicate entry", 409);
  }

  console.error(err);
  return jsonError(fallback, 500);
}

export function parsePositiveIntId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}

/** Allowed hosts for stored image URLs (matches next.config remotePatterns). */
const IMAGE_HOSTS = new Set(["res.cloudinary.com", "images.unsplash.com"]);

export function isAllowedImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return IMAGE_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

export function imageUrlSchemaMessage() {
  return "Image must be an https URL on res.cloudinary.com or images.unsplash.com";
}
