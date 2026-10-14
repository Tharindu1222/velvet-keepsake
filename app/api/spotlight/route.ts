import { NextResponse } from "next/server";
import { getPool, type SpotlightRow } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { insertOrdered } from "@/lib/crud";
import { imageUrlField, readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

const schema = z.object({
  couple: z.string().trim().min(1).max(255),
  type: z.string().trim().min(1).max(255),
  location: z.string().trim().min(1).max(255),
  image: imageUrlField,
  sort_order: sortOrderField,
});

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, couple, type, location, image, sort_order FROM spotlight ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(rows as SpotlightRow[]);
  } catch (err) {
    return handleRouteError(err, "Could not load spotlight items");
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = schema.parse(await readJsonBody(request));
    const { sort_order, ...fields } = body;
    const id = await insertOrdered("spotlight", fields, sort_order);
    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "Could not save spotlight item");
  }
}
