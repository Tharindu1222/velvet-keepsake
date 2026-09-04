import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

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

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = schema.parse(await request.json());
    const isFeatured = body.is_featured ? 1 : 0;
    const pool = getPool();
    await pool.query(
      "UPDATE packages SET category = :category, name = :name, subtitle = :subtitle, price = :price, badge = :badge, features = :features, is_featured = :is_featured, sort_order = :sort_order WHERE id = :id",
      { id, ...body, is_featured: isFeatured, sort_order: body.sort_order ?? 0 }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not update package" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const pool = getPool();
    await pool.query("DELETE FROM packages WHERE id = :id", { id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not delete package" }, { status: 400 });
  }
}
