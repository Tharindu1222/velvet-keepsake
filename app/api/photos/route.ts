import { NextResponse } from "next/server";
import { getPool, type Photo, type PhotoCategory } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { photoCategorySchema, photoCreateSchema, readJsonBody } from "@/lib/schemas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawCategory = searchParams.get("category");

  let category: PhotoCategory | null = null;
  if (rawCategory && rawCategory !== "All") {
    const parsed = photoCategorySchema.safeParse(rawCategory);
    if (!parsed.success) return jsonError("Invalid category", 400);
    category = parsed.data;
  }

  try {
    const pool = getPool();

    let rows;
    if (category) {
      [rows] = await pool.query(
        `SELECT id, url, public_id, category, title, alt_text, created_at
         FROM photos WHERE category = :category ORDER BY created_at DESC, id DESC`,
        { category }
      );
    } else {
      [rows] = await pool.query(
        `SELECT id, url, public_id, category, title, alt_text, created_at
         FROM photos ORDER BY created_at DESC, id DESC`
      );
    }

    return NextResponse.json(rows as Photo[]);
  } catch (err) {
    return handleRouteError(err, "Could not load photos");
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = photoCreateSchema.parse(await readJsonBody(request));
    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO photos (url, public_id, category, title, alt_text)
       VALUES (:url, :public_id, :category, :title, :alt_text)`,
      {
        url: body.url,
        public_id: body.public_id || null,
        category: body.category,
        title: body.title || null,
        alt_text: body.alt_text || null,
      }
    );

    const insert = result as { insertId: number };
    return NextResponse.json({ id: insert.insertId, ...body }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "Could not save photo");
  }
}
