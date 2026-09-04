"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function CountUpStat({
  value,
  suffix = "",
  label,
  delay = 0,
  className = "",
}: {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
  className?: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = numRef.current;
    if (!el) return;
    const counter = { val: 0 };
    const tween = gsap.to(counter, {
      val: value,
      duration: 1.6,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (el) el.textContent = Math.round(counter.val).toString();
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, delay]);

  return (
    <div className={`flex flex-col items-center gap-1 text-center sm:items-start ${className}`}>
      <p className="font-display text-3xl text-white sm:text-4xl">
        <span ref={numRef}>0</span>
        {suffix}
      </p>
      <p className="text-[10px] tracking-[0.22em] uppercase text-white/55">
        {label}
      </p>
    </div>
  );
}
