"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  items: React.ReactNode[];
  /** Scroll distance (as a fraction of viewport height) per image transition. */
  stepVh?: number;
};

/**
 * Each slide (except the last) is rendered as two clipped "doors" — a left
 * half and a right half — stacked on top of the next slide. As you scroll,
 * the doors slide apart (left one to the left, right one to the right),
 * revealing the slide beneath, like a pair of doors opening outward.
 */
export default function ScrollWipeGallery({ items, stepVh = 1 }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftDoorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightDoorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || items.length < 2) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${(items.length - 1) * stepVh * 100}%`,
        scrub: true,
        pin: true,
        pinType: "transform",
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    for (let i = 0; i < items.length - 1; i++) {
      const left = leftDoorRefs.current[i];
      const right = rightDoorRefs.current[i];
      if (!left || !right) continue;

      // Drive both doors from a single proxy value so they are always
      // perfectly mirrored — never independently tweened — avoiding any
      // chance of one side visually lagging the other.
      const proxy = { p: 0 };
      tl.to(
        proxy,
        {
          p: 1,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: () => {
            gsap.set(left, { xPercent: -100 * proxy.p });
            gsap.set(right, { xPercent: 100 * proxy.p });
          },
        },
        i
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [items.length]);

  return (
    <div ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {items.map((node, i) => {
        const isLast = i === items.length - 1;
        const zIndex = items.length - i;

        if (isLast) {
          return (
            <div key={i} className="absolute inset-0" style={{ zIndex }}>
              {node}
            </div>
          );
        }

        return (
          <div key={i} className="absolute inset-0" style={{ zIndex }}>
            <div
              ref={(el) => {
                leftDoorRefs.current[i] = el;
              }}
              className="absolute inset-0 overflow-hidden will-change-transform"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            >
              {node}
            </div>
            <div
              ref={(el) => {
                rightDoorRefs.current[i] = el;
              }}
              className="absolute inset-0 overflow-hidden will-change-transform"
              style={{ clipPath: "inset(0 0 0 50%)" }}
            >
              {node}
            </div>
          </div>
        );
      })}
    </div>
  );
}
