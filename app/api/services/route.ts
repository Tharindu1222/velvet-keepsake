import { NextResponse } from "next/server";
import { getPool, type ServiceRow } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/api";
import { insertOrdered } from "@/lib/crud";
import { imageUrlField, readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(1).max(255),
  copy: z.string().trim().min(1).max(5000),
  image: imageUrlField,
  sort_order: sortOrderField,
});

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, title, copy, image, sort_order FROM services ORDER BY sort_order ASC, id ASC"
    );
    return NextResponse.json(rows as ServiceRow[]);
  } catch (err) {
    return handleRouteError(err, "Could not load services");
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  try {
    const body = schema.parse(await readJsonBody(request));
    const { sort_order, ...fields } = body;
    const id = await insertOrdered("services", fields, sort_order);
    return NextResponse.json({ id, ...body }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "Could not save service");
  }
}
