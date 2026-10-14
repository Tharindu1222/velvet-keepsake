import { NextResponse } from "next/server";
import { getPool, type HeroStat } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { insertOrdered } from "@/lib/crud";
import { readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

const schema = z.object({
  value: z.number().int().min(0).max(1_000_000_000),
  suffix: z.string().max(16).optional().default(""),
  label: z.string().trim().min(1).max(255),
  sort_order: sortOrderField,
});

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, value, suffix, label, sort_order FROM hero_stats ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(rows as HeroStat[]);
  } catch (err) {
    return handleRouteError(err, "Could not load hero stats");
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = schema.parse(await readJsonBody(request));
    const { sort_order, ...fields } = body;
    const id = await insertOrdered("hero_stats", fields, sort_order);
    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "Could not save hero stat");
  }
}
