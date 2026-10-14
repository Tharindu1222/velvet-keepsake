import { NextResponse } from "next/server";
import { getPool, type Photo } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { handleRouteError, jsonError, parsePositiveIntId } from "@/lib/api";
import { updateById } from "@/lib/crud";
import { photoUpdateSchema, readJsonBody } from "@/lib/schemas";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  const id = parsePositiveIntId((await params).id);
  if (id === null) return jsonError("Invalid id", 400);

  try {
    const body = photoUpdateSchema.parse(await readJsonBody(request));
    const affected = await updateById("photos", id, {
      category: body.category,
      title: body.title === undefined ? undefined : body.title || null,
      alt_text: body.alt_text === undefined ? undefined : body.alt_text || null,
    });
    if (affected === 0) return jsonError("Not found", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Could not update photo");
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  const id = parsePositiveIntId((await params).id);
  if (id === null) return jsonError("Invalid id", 400);

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, public_id FROM photos WHERE id = :id",
      { id }
    );
    const photo = (rows as Pick<Photo, "id" | "public_id">[])[0];
    if (!photo) return jsonError("Not found", 404);

    const [result] = await pool.query("DELETE FROM photos WHERE id = :id", { id });
    if ((result as { affectedRows: number }).affectedRows === 0) {
      return jsonError("Not found", 404);
    }

    if (photo.public_id) {
      try {
        await cloudinary.uploader.destroy(photo.public_id);
      } catch (cloudErr) {
        console.error("Cloudinary delete failed:", cloudErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Could not delete photo");
  }
}
