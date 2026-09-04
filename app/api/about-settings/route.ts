import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getAboutSettings } from "@/lib/data";
import { z } from "zod";

const schema = z.object({
  about_hero_image: z.string().optional(),
  about_intro_image: z.string().optional(),
  about_services_image: z.string().optional(),
});

export async function GET() {
  try {
    const settings = await getAboutSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = schema.parse(await request.json());
    const pool = getPool();

    for (const [key, value] of Object.entries(body)) {
      if (value === undefined) continue;
      await pool.query(
        `INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value)
         ON DUPLICATE KEY UPDATE setting_value = :value`,
        { key, value }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save settings" }, { status: 400 });
  }
}
