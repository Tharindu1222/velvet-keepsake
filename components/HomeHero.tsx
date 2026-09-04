"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import CountUpStat from "@/components/CountUpStat";
import ImageCursorTrail from "@/components/ui/image-cursor-trail";
import type { HeroSlide, HeroStat } from "@/lib/db";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  slides: HeroSlide[];
  stats: HeroStat[];
  settings: Record<string, string>;
};

// A curated set of portfolio-style frames for the cursor trail — reusing
// image IDs already verified elsewhere in this codebase (see lib/content.ts)
// rather than introducing new, unverified Unsplash URLs.
const CURSOR_TRAIL_IMAGES = [
  "https://images.unsplash.com/photo-1751247026229-518bfec9b5e6?w=480&q=75",
  "https://images.unsplash.com/photo-1748491829292-859b8ba52481?w=480&q=75",
  "https://images.unsplash.com/photo-1763030597070-6ec70fdea04b?w=480&q=75",
  "https://images.unsplash.com/photo-1580910531902-1112518b26ea?w=480&q=75",
  "https://images.unsplash.com/photo-1760533852055-724d3a50dcbd?w=480&q=75",
  "https://images.unsplash.com/photo-1676360109549-3d0b2bb72aa1?w=480&q=75",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=480&q=75",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=480&q=75",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=480&q=75",
];

export default function HomeHero({ slides: heroSlides, stats: heroStats, settings }: Props) {
  const root = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);
  const [trailEnabled, setTrailEnabled] = useState(false);
  const kicker = settings.hero_kicker || "Fine Art · Weddings · Island-Wide";
  const headingLine1 = settings.hero_heading_line1 || "Sri Lanka's Finest";
  const headingLine2 = settings.hero_heading_line2 || "Wedding Photography,";
  const headingPrefix = settings.hero_heading_prefix || "Beautifully Told in";

  // Skip the pointer-driven image trail for reduced-motion / touch-only users.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    setTrailEnabled(!reduceMotion && hasFinePointer);
  }, []);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 4800);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        gsap.set(".hero-kicker, .hero-line, .hero-cta, .hero-stats, .hero-scroll", {
          opacity: 0,
          y: 42,
        });

        tl.to(".hero-kicker", { opacity: 1, y: 0, duration: 0.8 }, 0.15)
          .to(
            ".hero-line",
            { opacity: 1, y: 0, duration: 1.05, stagger: 0.12 },
            0.35
          )
          .to(".hero-cta", { opacity: 1, y: 0, duration: 0.85 }, "-=0.55")
          .to(".hero-stats", { opacity: 1, y: 0, duration: 0.85 }, "-=0.5")
          .to(".hero-scroll", { opacity: 1, y: 0, duration: 0.7 }, "-=0.35");

        gsap.to(".hero-scroll-cue", {
          y: 10,
          duration: 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(".hero-media", {
          yPercent: 16,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to(".hero-content", {
          opacity: 0,
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "center top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, root);

      return () => ctx.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative flex h-svh min-h-[680px] items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      <div className="hero-media absolute inset-0 will-change-transform">
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <Image
              src={s.image}
              alt={s.place}
              fill
              priority={i === 0}
              sizes="100vw"
              className="scale-105 object-cover object-center"
            />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-[#0A0A0A]/50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/55 via-transparent to-[#0A0A0A]/90" />
      </div>

      {/* Pointer-driven portfolio trail — sits above the media, below the
          text/CTAs (z-10) so it can never obscure or intercept clicks. */}
      {trailEnabled && (
        <ImageCursorTrail
          items={CURSOR_TRAIL_IMAGES}
          maxNumberOfImages={5}
          distance={26}
          fadeAnimation
          imgClass="w-24 h-32 sm:w-32 sm:h-40 lg:w-36 lg:h-44 shadow-[0_20px_45px_rgba(0,0,0,0.5)] border border-white/10"
          className="absolute inset-0 z-[5] h-full w-full rounded-none"
        />
      )}

      <div className="hero-content pointer-events-none relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <p className="hero-kicker mb-5 text-[11px] tracking-[0.4em] uppercase text-[#E5A93C]">
          {kicker}
        </p>

        <h1 className="font-display text-[clamp(2.25rem,6.5vw,5.25rem)] font-medium leading-[1.08] tracking-[-0.01em] text-white">
          <span className="hero-line block overflow-hidden">
            <span className="inline-block">{headingLine1}</span>
          </span>
          <span className="hero-line block overflow-hidden">
            <span className="inline-block">{headingLine2}</span>
          </span>
          <span className="hero-line relative block h-[1.15em] overflow-hidden">
            <span className="inline-flex items-baseline gap-3">
              {headingPrefix}
              <span className="inline-block min-w-[7ch] text-left text-[#E5A93C]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={heroSlides[slide]?.place ?? "place"}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {heroSlides[slide]?.place ?? ""}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </span>
        </h1>

        <div className="hero-cta pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton href="/reserve" variant="gold">
            Reserve Now
          </MagneticButton>
          <MagneticButton href="/portfolio">View Portfolio</MagneticButton>
        </div>

        <div className="hero-stats mt-16 grid grid-cols-2 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-x-10">
          {heroStats.map((stat, i) => (
            <CountUpStat
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 0.08}
              className="px-6 sm:px-0"
            />
          ))}
        </div>
      </div>

      <div className="hero-scroll pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <p className="text-[10px] tracking-[0.35em] uppercase text-white/70">
          Scroll down
        </p>
        <div className="hero-scroll-cue flex h-10 w-px items-end bg-gradient-to-b from-white/0 via-white/50 to-white/80" />
      </div>

      <div className="pointer-events-auto absolute bottom-8 right-6 z-10 hidden flex-col items-end gap-2 lg:flex lg:right-10">
        {heroSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSlide(i)}
            aria-label={`Show ${s.place}`}
            className="flex items-center gap-2"
          >
            <span
              className={`text-[10px] tracking-[0.2em] uppercase transition ${
                i === slide ? "text-white" : "text-white/40"
              }`}
            >
              {s.place}
            </span>
            <span
              className={`h-px transition-all ${
                i === slide ? "w-6 bg-[#E5A93C]" : "w-3 bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
