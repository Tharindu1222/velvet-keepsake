"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  items: React.ReactNode[];
  itemWidth?: string;
  gapClassName?: string;
};

export default function HorizontalScrollGallery({
  items,
  itemWidth = "min(78vw, 480px)",
  gapClassName = "gap-6 sm:gap-8 lg:gap-10",
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const distance = track.scrollWidth - section.clientWidth;
      if (distance <= 0) return;

      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: true,
          pin: true,
          pinType: "transform",
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [items.length]);

  return (
    <div
      ref={sectionRef}
      className="relative flex items-center overflow-hidden md:h-screen"
    >
      <div
        ref={trackRef}
        className={`flex ${gapClassName} overflow-x-auto px-6 will-change-transform md:overflow-visible lg:px-10`}
      >
        {items.map((node, i) => (
          <div key={i} className="relative shrink-0" style={{ width: itemWidth }}>
            {node}
          </div>
        ))}
        <div className="shrink-0" style={{ width: "1px" }} aria-hidden />
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent md:block" />
    </div>
  );
}
