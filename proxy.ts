import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "vk_admin_session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set — blocking admin access");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, getSecret());
      if (payload.role !== "admin") {
        throw new Error("invalid role");
      }
      return NextResponse.next();
    } catch {
      const res = NextResponse.redirect(new URL("/admin/login", request.url));
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
