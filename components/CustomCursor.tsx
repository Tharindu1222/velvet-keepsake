"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.4 });

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("cursor-enabled");

    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    }

    function onOver(e: PointerEvent) {
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [data-cursor-hover]")));
    }

    function onDown() {
      setPressed(true);
    }
    function onUp() {
      setPressed(false);
    }
    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("cursor-enabled");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y, isAdmin]);

  if (isAdmin) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.25s" }}
      aria-hidden
    >
      <motion.div
        className="absolute rounded-full bg-[#E5A93C]"
        style={{ left: x, top: y, width: 6, height: 6, x: "-50%", y: "-50%" }}
        animate={{ scale: pressed ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="absolute rounded-full border border-white/70"
        style={{
          left: ringX,
          top: ringY,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: hovering ? 56 : 30,
          height: hovering ? 56 : 30,
          opacity: hovering ? 0.9 : 0.5,
          borderColor: hovering ? "#E5A93C" : "rgba(255,255,255,0.7)",
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
