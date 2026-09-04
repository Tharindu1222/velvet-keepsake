"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { testimonials } from "@/lib/content";
import { LuxuryFadeIn } from "./LuxuryFadeIn";
import Link from "next/link";

gsap.registerPlugin(useGSAP);

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    const el = quoteRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
  }, [index]);

  const item = testimonials[index];

  return (
    <section className="bg-[#141414] px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <LuxuryFadeIn>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
            Wedding testimonials
          </p>
          <h2 className="mt-4 font-display text-4xl text-[#F5F5F7] sm:text-5xl">
            What couples say
          </h2>
        </LuxuryFadeIn>

        <div className="relative mt-14 min-h-[180px]">
          <blockquote ref={quoteRef} key={item.name}>
            <p className="font-display text-2xl leading-relaxed text-[#F5F5F7] sm:text-3xl">
              “{item.quote}”
            </p>
            <footer className="mt-8 text-[11px] tracking-[0.25em] uppercase text-[#8E8E93]">
              {item.name}
            </footer>
          </blockquote>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-1.5 rounded-full transition ${
                i === index ? "bg-[#E5A93C]" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        <Link
          href="/reviews"
          className="mt-10 inline-block text-[11px] tracking-[0.22em] uppercase text-[#8E8E93] hover:text-[#E5A93C]"
        >
          View more →
        </Link>
      </div>
    </section>
  );
}
