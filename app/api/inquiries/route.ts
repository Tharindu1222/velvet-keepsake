import { NextResponse } from "next/server";
import { getPool, type Inquiry } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { handleRouteError, jsonError } from "@/lib/api";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  wedding_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .optional()
    .nullable()
    .or(z.literal("")),
  message: z.string().trim().min(10).max(2000),
  package_name: z.string().trim().max(255).optional().nullable(),
  /** Honeypot — bots fill this; humans leave empty */
  website: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, name, email, wedding_date, message, created_at
       FROM inquiries ORDER BY created_at DESC LIMIT 500`
    );
    return NextResponse.json(rows as Inquiry[]);
  } catch (err) {
    console.error(err);
    return jsonError("Could not load inquiries", 500);
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`inquiry:${ip}`, 5, 60 * 60 * 1000);
  if (!limited.ok) {
    return jsonError("Too many inquiries. Please try again later.", 429, {
      retryAfterSec: limited.retryAfterSec,
    });
  }

  try {
    const raw = await request.json();
    const body = schema.parse(raw);

    if (body.website) {
      // Bot filled honeypot — pretend success
      return NextResponse.json({ ok: true });
    }

    const packageNote = body.package_name
      ? `\n\n[Package interest: ${body.package_name}]`
      : "";
    const message = `${body.message}${packageNote}`;

    const pool = getPool();
    await pool.query(
      `INSERT INTO inquiries (name, email, wedding_date, message)
       VALUES (:name, :email, :wedding_date, :message)`,
      {
        name: body.name,
        email: body.email,
        wedding_date: body.wedding_date || null,
        message,
      }
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return handleRouteError(err, "Could not send inquiry");
  }
}
