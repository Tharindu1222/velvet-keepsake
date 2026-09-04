"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/hero", label: "Hero Section" },
  { href: "/admin/about", label: "About Page" },
  { href: "/admin/locations", label: "Popular Locations" },
  { href: "/admin/services", label: "What We Offer" },
  { href: "/admin/spotlight", label: "Our Spotlight" },
  { href: "/admin/packages", label: "Packages" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-b border-white/10 bg-[#0A0A0A] px-6 py-6 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
          Admin
        </p>
        <h1 className="mt-2 font-display text-xl font-light text-[#F5F5F7]">
          Curator Panel
        </h1>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap border-l-2 px-3 py-2.5 text-[11px] tracking-[0.15em] uppercase transition ${
                active
                  ? "border-[#E5A93C] bg-white/[0.03] text-[#E5A93C]"
                  : "border-transparent text-[#8E8E93] hover:border-white/20 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5">
        <Link
          href="/"
          className="text-[10px] tracking-[0.2em] uppercase text-[#8E8E93] transition hover:text-white"
        >
          View Site ↗
        </Link>
        <button
          type="button"
          onClick={logout}
          className="border border-white/15 px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[#8E8E93] transition hover:border-[#E5A93C] hover:text-[#E5A93C]"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
