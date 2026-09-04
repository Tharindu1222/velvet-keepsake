import { NextResponse } from "next/server";
import { getPool, type Inquiry } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  wedding_date: z.string().optional().nullable(),
  message: z.string().min(10),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, name, email, wedding_date, message, created_at
       FROM inquiries ORDER BY created_at DESC`
    );
    return NextResponse.json(rows as Inquiry[]);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const pool = getPool();

    await pool.query(
      `INSERT INTO inquiries (name, email, wedding_date, message)
       VALUES (:name, :email, :wedding_date, :message)`,
      {
        name: body.name,
        email: body.email,
        wedding_date: body.wedding_date || null,
        message: body.message,
      }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not send inquiry" }, { status: 400 });
  }
}
