import { NextResponse } from "next/server";
import { getPool, type PackageRow } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  subtitle: z.string().optional().default(""),
  price: z.number().nonnegative(),
  badge: z.string().optional().default(""),
  features: z.string().min(1),
  is_featured: z.union([z.boolean(), z.number()]).optional().default(false),
  sort_order: z.number().int().optional(),
});

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, category, name, subtitle, price, badge, features, is_featured, sort_order FROM packages ORDER BY sort_order ASC, id ASC"
    );
    const list = (rows as PackageRow[]).map((p) => ({ ...p, price: Number(p.price) }));
    return NextResponse.json(list);
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
    const [countRows] = await pool.query("SELECT COUNT(*) AS c FROM packages");
    const count = (countRows as { c: number }[])[0].c;
    const isFeatured = body.is_featured ? 1 : 0;

    const [result] = await pool.query(
      "INSERT INTO packages (category, name, subtitle, price, badge, features, is_featured, sort_order) VALUES (:category, :name, :subtitle, :price, :badge, :features, :is_featured, :sort_order)",
      { ...body, is_featured: isFeatured, sort_order: body.sort_order ?? count }
    );
    const insert = result as { insertId: number };
    return NextResponse.json({ id: insert.insertId, ...body, is_featured: isFeatured });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save package" }, { status: 400 });
  }
}
