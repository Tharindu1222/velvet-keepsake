import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  image: z.string().min(1),
  place: z.string().min(1),
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
    const pool = getPool();
    await pool.query(
      "UPDATE hero_slides SET image = :image, place = :place, sort_order = :sort_order WHERE id = :id",
      { id, image: body.image, place: body.place, sort_order: body.sort_order ?? 0 }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not update hero slide" }, { status: 400 });
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
    await pool.query("DELETE FROM hero_slides WHERE id = :id", { id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not delete hero slide" }, { status: 400 });
  }
}
