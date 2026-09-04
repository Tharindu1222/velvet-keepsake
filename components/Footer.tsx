"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { brand, social } from "@/lib/content";
import MagneticButton from "@/components/MagneticButton";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#0A0A0A]">
      <div className="hairline-gradient absolute inset-x-0 top-0" />

      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:px-10">
        <div>
          <Image
            src="/logo-horizontal.png"
            alt={brand.name}
            width={896}
            height={112}
            className="h-8 w-auto"
          />
          <p className="mt-4 max-w-xs font-display text-lg italic text-[#E5A93C]">
            {brand.intro}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#8E8E93]">
            Sri Lanka&apos;s finest wedding photography, island-wide.
          </p>
          <div className="mt-8 space-y-2.5 text-sm text-[#8E8E93]">
            <a
              href={`tel:${brand.phone.replace(/\s/g, "")}`}
              className="block transition hover:text-[#E5A93C]"
            >
              {brand.phone}
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="block transition hover:text-[#E5A93C]"
            >
              {brand.email}
            </a>
            <p>{brand.address}</p>
          </div>
          <div className="mt-7 flex items-center gap-4">
            <a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#8E8E93] transition hover:border-[#E5A93C] hover:text-[#E5A93C]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.9.25-1.5 1.5-1.5H16.5V4.3c-.6-.08-1.6-.15-2.5-.15-2.5 0-4 1.35-4 4v2.35H8v3h2v7.5h3.5Z" />
              </svg>
            </a>
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#8E8E93] transition hover:border-[#E5A93C] hover:text-[#E5A93C]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                <circle cx="12" cy="12" r="3.6" />
                <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#8E8E93] transition hover:border-[#E5A93C] hover:text-[#E5A93C]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12.04 3.5a8.46 8.46 0 0 0-7.2 12.87L3.5 20.5l4.27-1.3a8.46 8.46 0 1 0 4.27-15.7Zm0 1.5a6.96 6.96 0 1 1-3.55 12.95l-.25-.15-2.44.74.76-2.37-.16-.26A6.96 6.96 0 0 1 12.04 5Zm3.9 8.62c-.2-.1-1.2-.6-1.39-.66-.19-.07-.32-.1-.46.1-.14.2-.53.66-.65.8-.12.13-.24.15-.45.05-.6-.3-1.24-.7-1.79-1.24-.5-.5-.85-1-1.1-1.44-.13-.2-.02-.32.1-.44.13-.13.24-.3.36-.44.12-.15.16-.25.24-.4.08-.16.04-.3-.02-.4-.06-.1-.55-1.34-.76-1.83-.16-.4-.33-.36-.46-.36-.12 0-.32-.03-.5-.03-.16 0-.44.06-.6.24-.2.2-.75.72-.75 1.75s.77 2.03.88 2.17c.1.14 1.5 2.32 3.72 3.14 2.22.83 2.22.55 2.63.5.4-.03 1.28-.51 1.46-1.02.18-.5.18-.93.13-1.02-.05-.1-.2-.15-.4-.25Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <p className="mb-5 text-[10px] tracking-[0.28em] uppercase text-[#E5A93C]">
            Explore
          </p>
          <ul className="space-y-3 text-sm text-[#8E8E93]">
            <li>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="transition hover:text-white">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="transition hover:text-white">
                Reviews
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[10px] tracking-[0.28em] uppercase text-[#E5A93C]">
            Useful Links
          </p>
          <ul className="space-y-3 text-sm text-[#8E8E93]">
            <li>
              <Link href="/locations" className="transition hover:text-white">
                Locations
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/packages" className="transition hover:text-white">
                Packages
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="transition hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[10px] tracking-[0.28em] uppercase text-[#E5A93C]">
            Begin
          </p>
          <p className="text-sm leading-relaxed text-[#8E8E93]">
            Secure your date for a celebration anywhere across Sri Lanka.
          </p>
          <div className="mt-6">
            <MagneticButton href="/reserve" variant="gold" className="!px-6 !py-2.5">
              Reserve Now
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-[10px] tracking-[0.18em] uppercase text-[#8E8E93]/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p className="text-[#8E8E93]/40">Crafted for timeless keepsakes</p>
        </div>
      </div>
    </footer>
  );
}
