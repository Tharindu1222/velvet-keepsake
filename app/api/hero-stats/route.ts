import { NextResponse } from "next/server";
import { getPool, type HeroStat } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  value: z.number().int(),
  suffix: z.string().max(16).optional().default(""),
  label: z.string().min(1),
  sort_order: z.number().int().optional(),
});

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, value, suffix, label, sort_order FROM hero_stats ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(rows as HeroStat[]);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = schema.parse(await request.json());
    const pool = getPool();
    const [countRows] = await pool.query("SELECT COUNT(*) AS c FROM hero_stats");
    const count = (countRows as { c: number }[])[0].c;

    const [result] = await pool.query(
      "INSERT INTO hero_stats (value, suffix, label, sort_order) VALUES (:value, :suffix, :label, :sort_order)",
      { ...body, sort_order: body.sort_order ?? count }
    );
    const insert = result as { insertId: number };
    return NextResponse.json({ id: insert.insertId, ...body });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save hero stat" }, { status: 400 });
  }
}
