import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
  hashPassword,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { handleRouteError, jsonError } from "@/lib/api";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!limited.ok) {
    return jsonError("Too many login attempts. Try again later.", 429, {
      retryAfterSec: limited.retryAfterSec,
    });
  }

  try {
    const body = await request.json();
    const { email, password } = schema.parse(body);
    const pool = getPool();

    const [rows] = await pool.query(
      "SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1",
      { email }
    );
    const admins = rows as Array<{
      id: number;
      email: string;
      password_hash: string;
    }>;

    let admin = admins[0];

    if (!admin) {
      const [countRows] = await pool.query(
        "SELECT COUNT(*) AS c FROM admins"
      );
      const adminCount = (countRows as { c: number }[])[0]?.c ?? 0;
      const envEmail = process.env.ADMIN_EMAIL;
      const envPassword = process.env.ADMIN_PASSWORD;

      const canBootstrap =
        adminCount === 0 &&
        !!envEmail &&
        !!envPassword &&
        email === envEmail &&
        password === envPassword;

      if (!canBootstrap) {
        return jsonError("Invalid credentials", 401);
      }

      const password_hash = await hashPassword(password);
      const [insertResult] = await pool.query(
        "INSERT INTO admins (email, password_hash) VALUES (:email, :password_hash)",
        { email, password_hash }
      );
      const insert = insertResult as { insertId: number };
      admin = { id: insert.insertId, email, password_hash };
    } else {
      const ok = await verifyPassword(password, admin.password_hash);
      if (!ok) {
        return jsonError("Invalid credentials", 401);
      }
    }

    const token = await createSessionToken(admin.email);
    await setSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Login failed");
  }
}
