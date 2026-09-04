"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0 });

    // A single reusable "quick" setter is far cheaper per-frame than
    // spinning up a brand-new tween on every scroll tick (which was
    // competing with pinned ScrollTrigger sections for main-thread time
    // during fast wheel/trackpad scrolling and contributing to jitter).
    const setScaleX = gsap.quickTo(bar, "scaleX", {
      duration: 0.2,
      ease: "none",
    });

    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      invalidateOnRefresh: true,
      onUpdate: (self) => setScaleX(self.progress),
    });

    return () => trigger.kill();
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] bg-white/5">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-[#E5A93C]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
