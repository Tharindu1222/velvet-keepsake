import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
  hashPassword,
} from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
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

    // Bootstrap first admin from env if table is empty / email matches
    if (!admin) {
      const envEmail = process.env.ADMIN_EMAIL;
      const envPassword = process.env.ADMIN_PASSWORD;
      if (envEmail && envPassword && email === envEmail && password === envPassword) {
        const password_hash = await hashPassword(password);
        await pool.query(
          "INSERT INTO admins (email, password_hash) VALUES (:email, :password_hash)",
          { email, password_hash }
        );
        admin = { id: 0, email, password_hash };
      } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } else {
      const ok = await verifyPassword(password, admin.password_hash);
      if (!ok) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    const token = await createSessionToken(admin.email);
    await setSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}
