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

const PLACEHOLDERS: Photo[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    public_id: null,
    category: "Ceremony",
    title: "Aisle light",
    alt_text: "Bride walking down the aisle",
    created_at: new Date(),
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
    public_id: null,
    category: "Portraits",
    title: "Golden hour",
    alt_text: "Couple portrait at sunset",
    created_at: new Date(),
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80",
    public_id: null,
    category: "Candid",
    title: "Quiet laugh",
    alt_text: "Candid wedding moment",
    created_at: new Date(),
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
    public_id: null,
    category: "Details",
    title: "Silk & stone",
    alt_text: "Wedding ring detail",
    created_at: new Date(),
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80",
    public_id: null,
    category: "Reception",
    title: "First dance",
    alt_text: "Couple dancing at reception",
    created_at: new Date(),
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1511285560929-80b4565783ab?w=1200&q=80",
    public_id: null,
    category: "Destination",
    title: "Coastal vows",
    alt_text: "Destination wedding by the sea",
    created_at: new Date(),
  },
];

export default function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [filter, setFilter] = useState<"All" | PhotoCategory>("All");
  const source = photos.length > 0 ? photos : PLACEHOLDERS;

  const filtered = useMemo(() => {
    if (filter === "All") return source;
    return source.filter((p) => p.category === filter);
  }, [filter, source]);

  return (
    <div>
      <div className="mb-12 flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
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
