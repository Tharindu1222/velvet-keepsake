import { NextResponse } from "next/server";
import { getPool, type ShootImage } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError, parsePositiveIntId } from "@/lib/api";
import { insertOrdered } from "@/lib/crud";
import { imageUrlField, readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

const schema = z.object({
  spotlight_id: z.number().int().min(1),
  image: imageUrlField,
  sort_order: sortOrderField,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spotlightId = parsePositiveIntId(searchParams.get("spotlight_id") ?? "");
  if (spotlightId === null) {
    return jsonError("spotlight_id is required", 400);
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, spotlight_id, image, sort_order FROM shoot_images WHERE spotlight_id = :spotlightId ORDER BY sort_order ASC, id ASC",
      { spotlightId }
    );
    return NextResponse.json(rows as ShootImage[]);
  } catch (err) {
    return handleRouteError(err, "Could not load shoot images");
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = schema.parse(await readJsonBody(request));
    const { sort_order, ...fields } = body;
    const id = await insertOrdered("shoot_images", fields, sort_order, {
      column: "spotlight_id",
      value: body.spotlight_id,
    });
    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err) {
    const code =
      typeof err === "object" && err && "code" in err
        ? String((err as { code: unknown }).code)
        : "";
    if (code === "ER_NO_REFERENCED_ROW_2") {
      return jsonError("Spotlight item not found", 404);
    }
    return handleRouteError(err, "Could not add shoot image");
  }
}
