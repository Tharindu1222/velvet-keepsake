import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { readSettings, upsertSettings } from "@/lib/crud";
import { defaultHeroSettings } from "@/lib/data";
import { readJsonBody } from "@/lib/schemas";
import { z } from "zod";

const HERO_KEYS = Object.keys(defaultHeroSettings);

const schema = z.object({
  hero_kicker: z.string().trim().max(255).optional(),
  hero_heading_line1: z.string().trim().max(255).optional(),
  hero_heading_line2: z.string().trim().max(255).optional(),
  hero_heading_prefix: z.string().trim().max(255).optional(),
});

export async function GET() {
  try {
    const stored = await readSettings(HERO_KEYS);
    return NextResponse.json({ ...defaultHeroSettings, ...stored });
  } catch (err) {
    return handleRouteError(err, "Could not load hero settings");
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = schema.parse(await readJsonBody(request));
    await upsertSettings(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Could not save settings");
  }
}
