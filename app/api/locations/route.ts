import { NextResponse } from "next/server";
import { getPool, type LocationRow } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  badge: z.string().min(1),
  highlight: z.string().min(1),
  image: z.string().min(1),
  sort_order: z.number().int().optional(),
});

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, slug, title, subtitle, badge, highlight, image, sort_order FROM locations ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(rows as LocationRow[]);
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
    const [countRows] = await pool.query("SELECT COUNT(*) AS c FROM locations");
    const count = (countRows as { c: number }[])[0].c;

    const [result] = await pool.query(
      `INSERT INTO locations (slug, title, subtitle, badge, highlight, image, sort_order)
       VALUES (:slug, :title, :subtitle, :badge, :highlight, :image, :sort_order)`,
      { ...body, sort_order: body.sort_order ?? count }
    );
    const insert = result as { insertId: number };
    return NextResponse.json({ id: insert.insertId, ...body });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save location (slug may already exist)" }, { status: 400 });
  }
}
