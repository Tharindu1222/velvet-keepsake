import { NextResponse } from "next/server";
import { getPool, type HeroSlide } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { insertOrdered } from "@/lib/crud";
import { imageUrlField, readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

const schema = z.object({
  image: imageUrlField,
  place: z.string().trim().min(1).max(255),
  sort_order: sortOrderField,
});

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, image, place, sort_order FROM hero_slides ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(rows as HeroSlide[]);
  } catch (err) {
    return handleRouteError(err, "Could not load hero slides");
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = schema.parse(await readJsonBody(request));
    const { sort_order, ...fields } = body;
    const id = await insertOrdered("hero_slides", fields, sort_order);
    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "Could not save hero slide");
  }
}
