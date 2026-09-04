import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  hero_kicker: z.string().optional(),
  hero_heading_line1: z.string().optional(),
  hero_heading_line2: z.string().optional(),
  hero_heading_prefix: z.string().optional(),
});

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM site_settings");
    const list = rows as { setting_key: string; setting_value: string }[];
    const map: Record<string, string> = {};
    for (const row of list) map[row.setting_key] = row.setting_value;
    return NextResponse.json(map);
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
