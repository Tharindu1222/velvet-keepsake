"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { destinations } from "@/lib/content";

gsap.registerPlugin(useGSAP);

export default function DestinationsMarquee() {
  const track = useRef<HTMLDivElement>(null);
  const row = [...destinations, ...destinations];

  useGSAP(() => {
    const el = track.current;
    if (!el) return;

    const tween = gsap.to(el, {
      xPercent: -50,
      duration: 40,
      ease: "none",
      repeat: -1,
    });

    el.addEventListener("mouseenter", () => tween.pause());
    el.addEventListener("mouseleave", () => tween.resume());

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section className="overflow-hidden border-y border-white/5 bg-[#0A0A0A] py-10">
      <div className="mb-6 text-center text-[10px] tracking-[0.3em] uppercase text-[#8E8E93]">
        Photographing love, island-wide
      </div>
      <div className="relative">
        <div ref={track} className="flex w-max gap-10 whitespace-nowrap px-4 will-change-transform">
          {row.map((place, i) => (
            <span
              key={`${place}-${i}`}
              className="font-display text-2xl tracking-[0.08em] text-[#F5F5F7]/85 sm:text-3xl"
            >
              {place}
              <span className="ml-10 text-white/25">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
