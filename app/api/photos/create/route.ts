import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPool, type PhotoCategory } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  url: z.string().url(),
  public_id: z.string().optional().nullable(),
  category: z.enum([
    "Candid",
    "Destination",
    "Portraits",
    "Ceremony",
    "Reception",
    "Details",
  ]),
  title: z.string().optional().nullable(),
  alt_text: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = schema.parse(await request.json());
    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO photos (url, public_id, category, title, alt_text)
       VALUES (:url, :public_id, :category, :title, :alt_text)`,
      {
        url: body.url,
        public_id: body.public_id ?? null,
        category: body.category as PhotoCategory,
        title: body.title ?? null,
        alt_text: body.alt_text ?? null,
      }
    );

    const insert = result as { insertId: number };
    return NextResponse.json({ id: insert.insertId, ...body });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save photo" }, { status: 400 });
  }
}
