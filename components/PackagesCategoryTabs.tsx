"use client";

import { useState } from "react";
import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import PackagesGrid from "@/components/PackagesGrid";
import SplitHeading from "@/components/SplitHeading";
import type { PackageRow } from "@/lib/db";

const CATEGORY_ORDER = ["Special Offer", "Wedding", "Engagement", "Pre-Shoot"];

const CATEGORY_INTRO: Record<string, string> = {
  "Special Offer": "Limited-time offers with premium value additions.",
  Wedding: "Full wedding day coverage collections, from classic to royal.",
  Engagement: "Celebrate your promise with a dedicated engagement session.",
  "Pre-Shoot": "Romantic pre-wedding sessions across the island's finest backdrops.",
};

const CATEGORY_SLUGS: Record<string, string> = {
  "Special Offer": "special-offer",
  Wedding: "wedding",
  Engagement: "engagement",
  "Pre-Shoot": "pre-shoot",
};

const TAB_LABELS: Record<string, string> = {
  Wedding: "Wedding Packages",
  "Pre-Shoot": "Pre-Shoot",
  Engagement: "Engagement",
  "Special Offer": "Special Offer",
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type Props = {
  packages: PackageRow[];
};

export default function PackagesCategoryTabs({ packages }: Props) {
  const [active, setActive] = useState<string>("All");

  // Known categories first (in their preferred order), then any custom
  // categories added from the admin panel, in the order they first appear.
  const extraCategories = Array.from(new Set(packages.map((p) => p.category))).filter(
    (c) => !CATEGORY_ORDER.includes(c)
  );
  const allCategories = [...CATEGORY_ORDER, ...extraCategories].filter((category) =>
    packages.some((p) => p.category === category)
  );

  const tabs = [
    { key: "All", label: "All Packages" },
    ...allCategories.map((c) => ({ key: c, label: TAB_LABELS[c] ?? c })),
  ];
  const visibleCategories = active === "All" ? allCategories : allCategories.filter((c) => c === active);

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`border px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase transition ${
              active === tab.key
                ? "border-[#E5A93C] bg-[#E5A93C]/10 text-[#E5A93C]"
                : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleCategories.map((category, i) => {
        const items = packages.filter((p) => p.category === category);
        if (items.length === 0) return null;
        return (
          <section
            key={category}
            id={CATEGORY_SLUGS[category] ?? slugify(category)}
            className={`scroll-mt-32 ${i === 0 ? "mt-16" : "mt-24"}`}
          >
            <LuxuryFadeIn>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
                {category}
              </p>
            </LuxuryFadeIn>
            <SplitHeading className="mt-3 font-display text-3xl text-white sm:text-4xl">
              {`${category} Packages`}
            </SplitHeading>
            {CATEGORY_INTRO[category] && (
              <LuxuryFadeIn delay={0.08}>
                <p className="mt-3 max-w-xl text-sm font-light text-[#8E8E93]">
                  {CATEGORY_INTRO[category]}
                </p>
              </LuxuryFadeIn>
            )}
            <PackagesGrid packages={items} />
          </section>
        );
      })}
    </>
  );
}
