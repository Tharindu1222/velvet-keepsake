"use client";

import Link from "next/link";
import { MouseEvent, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "outline" | "gold";
};

export default function MagneticButton({
  href,
  children,
  className = "",
  variant = "outline",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  function onMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.5);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    variant === "solid"
      ? "border border-white bg-white text-[#0A0A0A] hover:bg-transparent hover:text-white"
      : variant === "gold"
      ? "border border-[#E5A93C] bg-[#E5A93C] text-[#0A0A0A] hover:bg-transparent hover:text-[#E5A93C]"
      : "border border-white/80 text-white hover:bg-white hover:text-[#0A0A0A]";

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={`relative inline-flex items-center justify-center px-10 py-3.5 text-[11px] font-medium tracking-[0.28em] uppercase transition-colors duration-500 ${base} ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
