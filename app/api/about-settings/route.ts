import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { readSettings, upsertSettings } from "@/lib/crud";
import { defaultAboutSettings } from "@/lib/data";
import { imageUrlField, readJsonBody } from "@/lib/schemas";
import { z } from "zod";

const ABOUT_KEYS = Object.keys(defaultAboutSettings);

const schema = z.object({
  about_hero_image: imageUrlField.optional(),
  about_intro_image: imageUrlField.optional(),
  about_services_image: imageUrlField.optional(),
});

export async function GET() {
  try {
    const stored = await readSettings(ABOUT_KEYS);
    return NextResponse.json({ ...defaultAboutSettings, ...stored });
  } catch (err) {
    return handleRouteError(err, "Could not load about settings");
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
