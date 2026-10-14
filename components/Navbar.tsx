"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

gsap.registerPlugin(useGSAP);

const packageLinks = [
  { href: "/packages", label: "All Packages" },
  { href: "/packages#wedding", label: "Wedding Packages" },
  { href: "/packages#pre-shoot", label: "Pre-Shoot" },
  { href: "/packages#engagement", label: "Engagement" },
  { href: "/packages#special-offer", label: "Special Offer" },
];

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/locations", label: "Locations" },
  { href: "/packages", label: "Packages", children: packageLinks },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(null);
    setHovered(null);
  }, [pathname]);

  // Esc closes the mobile menu and any open dropdown
  useEffect(() => {
    if (!open && !dropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const wasMobileOpen = open;
      setOpen(false);
      setDropdownOpen(null);
      setHovered(null);
      if (wasMobileOpen) menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dropdownOpen]);

  // Click/tap outside closes the dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest("[data-nav-item]")) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [dropdownOpen]);

  useGSAP(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(
      ".mobile-nav-link",
      { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
      {
        opacity: 1,
        y: 0,
        duration: reduce ? 0 : 0.45,
        stagger: reduce ? 0 : 0.06,
        ease: "power3.out",
      }
    );
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  const onHome = pathname === "/";
  const solid = scrolled || !onHome;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-white/[0.06] bg-[#0A0A0A]/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="flex items-center transition hover:opacity-80">
          <Image
            src="/logo-horizontal.png"
            alt="Velvet Keepsake"
            width={896}
            height={112}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </Link>

        <ul
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {links.map((link) => {
            const active = pathname === link.href;
            const dropdownShown =
              !!link.children &&
              (hovered === link.href || dropdownOpen === link.href);
            return (
              <li
                key={link.href}
                data-nav-item
                className="relative px-4 py-2"
                onMouseEnter={() => setHovered(link.href)}
                onBlur={(e) => {
                  if (
                    link.children &&
                    !e.currentTarget.contains(e.relatedTarget as Node | null)
                  ) {
                    setDropdownOpen((cur) => (cur === link.href ? null : cur));
                  }
                }}
              >
                <div className="relative z-10 flex items-center gap-1">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[11px] tracking-[0.22em] uppercase transition ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <button
                    type="button"
                    aria-label={`${link.label} menu`}
                    aria-haspopup="true"
                    aria-expanded={dropdownShown}
                    aria-controls={`nav-dropdown-${link.label.toLowerCase()}`}
                    onClick={() =>
                      setDropdownOpen((cur) =>
                        cur === link.href ? null : link.href
                      )
                    }
                    className="flex h-5 w-5 items-center justify-center text-white/60 transition hover:text-white focus-visible:outline-2 focus-visible:outline-[#E5A93C]"
                  >
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 10 6"
                      fill="none"
                      aria-hidden="true"
                      className={`transition-transform duration-300 ${
                        dropdownShown ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                </div>
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-white/[0.06]"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-4 right-4 h-px bg-[#E5A93C]"
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                {link.children && (
                  <AnimatePresence>
                    {dropdownShown && (
                      <motion.div
                        id={`nav-dropdown-${link.label.toLowerCase()}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 border border-white/10 bg-[#0A0A0A]/95 p-2 backdrop-blur-xl"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-sm px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase text-white/70 transition hover:bg-white/[0.06] hover:text-[#E5A93C]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            );
          })}
          <li className="ml-4">
            <MagneticButton href="/reserve" variant="outline" className="!px-6 !py-2.5">
              Reserve Now
            </MagneticButton>
          </li>
        </ul>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="relative z-10 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`mb-1.5 block h-px w-6 bg-current transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`mb-1.5 block h-px w-6 bg-current transition-opacity duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-4 bg-current transition-transform duration-300 ${
              open ? "w-6 -translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-white/[0.06] bg-[#0A0A0A]/98 px-6 py-8 backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col gap-6">
            {links.map((link) => (
              <li key={link.href} className="mobile-nav-link">
                <Link href={link.href} className="font-display text-2xl text-white">
                  {link.label}
                </Link>
                {link.children && (
                  <ul className="mt-3 flex flex-col gap-3 border-l border-white/10 pl-4">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="text-[11px] tracking-[0.2em] uppercase text-white/50 transition hover:text-[#E5A93C]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="mobile-nav-link pt-2">
              <MagneticButton href="/reserve" variant="solid">
                Reserve Now
              </MagneticButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
