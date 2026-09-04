"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let normalized = false;

/**
 * Mounted once at the root layout. Tells ScrollTrigger to take over
 * wheel/touch scroll normalization so that fast/rapid wheel bursts and
 * trackpad momentum scrolling produce smooth, evenly-spaced scroll
 * updates instead of the large, uneven jumps some browsers/devices
 * dispatch natively. This is the officially recommended fix for
 * shake/jitter on pinned + scrubbed ScrollTrigger sections.
 *
 * Guarded by a module-level flag + cleanup so React's dev-mode double
 * effect invocation (and page/route remounts) never register it twice
 * or leave a stale instance behind.
 */
export default function ScrollSetup() {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (normalized) return;
    normalized = true;

    const scroller = ScrollTrigger.normalizeScroll(true);

    return () => {
      if (scroller && typeof scroller.kill === "function") {
        scroller.kill();
      }
      normalized = false;
    };
  }, []);

  return null;
}
