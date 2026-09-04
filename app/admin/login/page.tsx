"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin/inquiries");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-6">
      <div className="w-full max-w-md border border-white/10 bg-[#141414] p-10">
        <Link
          href="/"
          className="text-[10px] tracking-[0.2em] uppercase text-[#8E8E93] hover:text-[#E5A93C]"
        >
          ← Site
        </Link>
        <h1 className="mt-6 font-display text-3xl text-[#F5F5F7]">
          Curator Sign-In
        </h1>
        <p className="mt-2 text-sm text-[#8E8E93]">
          Velvet Keepsake admin access
        </p>
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <label className="block">
            <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              className="w-full border-b border-white/15 bg-transparent py-3 text-[#F5F5F7] outline-none focus:border-[#E5A93C]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              className="w-full border-b border-white/15 bg-transparent py-3 text-[#F5F5F7] outline-none focus:border-[#E5A93C]"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#E5A93C] bg-[#E5A93C] py-3 text-[11px] tracking-[0.22em] uppercase text-[#0A0A0A] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Enter dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
