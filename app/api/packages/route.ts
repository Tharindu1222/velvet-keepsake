import { NextResponse } from "next/server";
import { getPool, type PackageRow } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { insertOrdered } from "@/lib/crud";
import { readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

const schema = z.object({
  category: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(255),
  subtitle: z.string().trim().max(255).optional().default(""),
  price: z.number().nonnegative().max(9_999_999_999),
  badge: z.string().trim().max(64).optional().default(""),
  features: z.string().trim().min(1).max(10_000),
  is_featured: z.union([z.boolean(), z.number()]).optional().default(false),
  sort_order: sortOrderField,
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
    return handleRouteError(err, "Could not load packages");
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = schema.parse(await readJsonBody(request));
    const { sort_order, ...rest } = body;
    const fields = { ...rest, is_featured: body.is_featured ? 1 : 0 };
    const id = await insertOrdered("packages", fields, sort_order);
    return NextResponse.json(
      { id, ...body, is_featured: fields.is_featured },
      { status: 201 }
    );
  } catch (err) {
    return handleRouteError(err, "Could not save package");
  }
}
