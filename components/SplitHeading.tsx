"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

type Props = {
  children: string;
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
  /** Reveal immediately (e.g. above-the-fold) instead of on scroll into view */
  immediate?: boolean;
};

export default function SplitHeading({
  children,
  as = "h2",
  className = "",
  delay = 0,
  immediate = false,
}: Props) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const split = new SplitText(el, {
      type: "words",
      wordsClass: "split-word",
    });

    gsap.set(split.words, { yPercent: 115, opacity: 0 });

    const tween = gsap.to(split.words, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      delay,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: immediate
        ? undefined
        : {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, [children, delay, immediate]);

  const mergedClassName = `inline-block overflow-hidden [&_.split-word]:inline-block ${className}`;

  if (as === "h1") {
    return (
      <h1 ref={ref} className={mergedClassName}>
        {children}
      </h1>
    );
  }

  return (
    <h2 ref={ref} className={mergedClassName}>
      {children}
    </h2>
  );
}
