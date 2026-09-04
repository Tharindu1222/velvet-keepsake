import { NextResponse } from "next/server";
import { getPool, type ShootImage } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  spotlight_id: z.number().int(),
  image: z.string().min(1),
  sort_order: z.number().int().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spotlightId = Number(searchParams.get("spotlight_id"));
    if (!spotlightId) {
      return NextResponse.json({ error: "spotlight_id is required" }, { status: 400 });
    }

    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, spotlight_id, image, sort_order FROM shoot_images WHERE spotlight_id = :spotlightId ORDER BY sort_order ASC, id ASC",
      { spotlightId }
    );
    return NextResponse.json(rows as ShootImage[]);
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
    const [countRows] = await pool.query(
      "SELECT COUNT(*) AS c FROM shoot_images WHERE spotlight_id = :spotlightId",
      { spotlightId: body.spotlight_id }
    );
    const count = (countRows as { c: number }[])[0].c;

    const [result] = await pool.query(
      "INSERT INTO shoot_images (spotlight_id, image, sort_order) VALUES (:spotlight_id, :image, :sort_order)",
      { ...body, sort_order: body.sort_order ?? count }
    );
    const insert = result as { insertId: number };
    return NextResponse.json({ id: insert.insertId, ...body });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not add shoot image" }, { status: 400 });
  }
}
