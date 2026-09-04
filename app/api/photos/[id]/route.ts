import { NextResponse } from "next/server";
import { getPool, type Photo } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, url, public_id, category, title, alt_text, created_at FROM photos WHERE id = :id",
      { id }
    );
    const photo = (rows as Photo[])[0];

    await pool.query("DELETE FROM photos WHERE id = :id", { id });

    if (photo?.public_id) {
      try {
        await cloudinary.uploader.destroy(photo.public_id);
      } catch (cloudErr) {
        console.error("Cloudinary delete failed:", cloudErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not delete photo" }, { status: 400 });
  }
}
