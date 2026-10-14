import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPool, type LocationRow } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { insertOrdered } from "@/lib/crud";
import { imageUrlField, readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

const schema = z.object({
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  title: z.string().trim().min(1).max(255),
  subtitle: z.string().trim().min(1).max(512),
  badge: z.string().trim().min(1).max(255),
  highlight: z.string().trim().min(1).max(255),
  image: imageUrlField,
  sort_order: sortOrderField,
});

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, slug, title, subtitle, badge, highlight, image, sort_order FROM locations ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(rows as LocationRow[]);
  } catch (err) {
    return handleRouteError(err, "Could not load locations");
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = schema.parse(await readJsonBody(request));
    const { sort_order, ...fields } = body;
    const id = await insertOrdered("locations", fields, sort_order);
    revalidatePath("/locations");
    revalidatePath(`/locations/${body.slug}`);
    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "Could not save location");
  }
}
