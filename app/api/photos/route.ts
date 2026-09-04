import { NextResponse } from "next/server";
import { getPool, type Photo } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const pool = getPool();

    let rows;
    if (category && category !== "All") {
      [rows] = await pool.query(
        `SELECT id, url, public_id, category, title, alt_text, created_at
         FROM photos WHERE category = :category ORDER BY created_at DESC`,
        { category }
      );
    } else {
      [rows] = await pool.query(
        `SELECT id, url, public_id, category, title, alt_text, created_at
         FROM photos ORDER BY created_at DESC`
      );
    }

    return NextResponse.json(rows as Photo[]);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 200 });
  }
}
