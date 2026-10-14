"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuxuryFadeIn } from "./LuxuryFadeIn";
import TiltCard from "./TiltCard";
import type { Photo, PhotoCategory } from "@/lib/db";

const FILTERS: Array<"All" | PhotoCategory> = [
  "All",
  "Candid",
  "Destination",
  "Portraits",
  "Ceremony",
  "Reception",
  "Details",
];

export default function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [filter, setFilter] = useState<"All" | PhotoCategory>("All");
  const source = photos;

  const filtered = useMemo(() => {
    if (filter === "All") return source;
    return source.filter((p) => p.category === filter);
  }, [filter, source]);

  if (photos.length === 0) {
    return (
      <div className="border border-white/10 bg-[#141414] px-6 py-20 text-center">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
          Gallery
        </p>
        <h3 className="mt-3 font-display text-2xl font-light text-[#F5F5F7]">
          Gallery coming soon
        </h3>
        <p className="mt-3 text-sm text-[#8E8E93]">
          We&apos;re curating our latest work. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12 flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`border px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition ${
              filter === f
                ? "border-[#E5A93C] text-[#E5A93C]"
                : "border-white/10 text-[#8E8E93] hover:border-white/25 hover:text-[#F5F5F7]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((photo, i) => (
            <LuxuryFadeIn key={`${photo.id}-${photo.url}`} delay={i * 0.05}>
              <motion.figure
                layout
                className="mb-4 break-inside-avoid overflow-hidden bg-[#141414]"
              >
                <TiltCard max={4} className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.alt_text || photo.title || "Wedding photograph"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-700 hover:scale-[1.05]"
                  />
                </TiltCard>
                <figcaption className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-[#F5F5F7]">
                    {photo.title || "Untitled"}
                  </span>
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#8E8E93]">
                    {photo.category}
                  </span>
                </figcaption>
              </motion.figure>
            </LuxuryFadeIn>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
