"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { faqs } from "@/lib/content";
import { LuxuryFadeIn } from "./LuxuryFadeIn";

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  function toggle(i: number) {
    const next = open === i ? null : i;

    panels.current.forEach((panel, idx) => {
      if (!panel) return;
      if (idx === next) {
        gsap.to(panel, {
          height: "auto",
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
        });
      } else {
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.inOut",
        });
      }
    });

    setOpen(next);
  }

  return (
    <section id="faq" className="bg-[#0A0A0A] px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <LuxuryFadeIn>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
            FAQs
          </p>
          <h2 className="mt-4 font-display text-4xl text-[#F5F5F7] sm:text-5xl">
            Answers before you book
          </h2>
          <p className="mt-4 text-base font-light text-[#8E8E93]">
            Common questions about services, destination coverage, and booking.
          </p>
        </LuxuryFadeIn>

        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-xl text-[#F5F5F7] sm:text-2xl">
                    {item.q}
                  </span>
                  <span className="mt-1 text-white/60">{isOpen ? "−" : "+"}</span>
                </button>
                <div
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  className="overflow-hidden"
                  style={{
                    height: i === 0 ? "auto" : 0,
                    opacity: i === 0 ? 1 : 0,
                  }}
                >
                  <p className="pb-6 text-sm leading-relaxed text-[#8E8E93]">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
