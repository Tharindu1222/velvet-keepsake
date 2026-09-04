"use client";

import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import MagneticButton from "@/components/MagneticButton";
import { motion } from "framer-motion";
import type { PackageRow } from "@/lib/db";

function formatLKR(value: number) {
  return `Rs. ${value.toLocaleString("en-LK")}`;
}

type Props = {
  packages: PackageRow[];
};

export default function PackagesGrid({ packages }: Props) {
  return (
    <div className="mt-16 grid gap-6 lg:grid-cols-3">
      {packages.map((pkg, i) => {
        const featured = !!pkg.is_featured;
        const features = pkg.features.split("\n").filter(Boolean);
        return (
          <LuxuryFadeIn key={pkg.id} delay={i * 0.1}>
            <motion.article
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex h-full flex-col overflow-hidden border p-8 backdrop-blur-sm ${
                featured
                  ? "border-[#E5A93C]/40 bg-[#141414]/90"
                  : "border-white/10 bg-[#141414]/60"
              }`}
            >
              {pkg.badge && (
                <span className="absolute right-6 top-6 text-[9px] tracking-[0.25em] uppercase text-[#E5A93C]">
                  {pkg.badge}
                </span>
              )}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
                  featured
                    ? "bg-gradient-to-r from-transparent via-[#E5A93C] to-transparent"
                    : "bg-white/10"
                }`}
              />
              <h2 className="font-display text-3xl text-white">{pkg.name}</h2>
              {pkg.subtitle && (
                <p className="mt-1 text-xs tracking-wide text-[#8E8E93]">
                  {pkg.subtitle}
                </p>
              )}
              <p className="mt-3 text-sm tracking-wide text-[#E5A93C]">
                {formatLKR(pkg.price)}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 border-t border-white/5 pt-3 text-sm text-white/85"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#E5A93C]" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <MagneticButton
                  href="/contact"
                  variant={featured ? "gold" : "outline"}
                  className="w-full !px-6 !py-3"
                >
                  Inquire
                </MagneticButton>
              </div>
            </motion.article>
          </LuxuryFadeIn>
        );
      })}
    </div>
  );
}
