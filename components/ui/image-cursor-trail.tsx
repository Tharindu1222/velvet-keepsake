"use client";

import React, { createRef, useRef, type ReactNode } from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ImageMouseTrailProps {
  items: string[];
  children?: ReactNode;
  className?: string;
  imgClass?: string;
  distance?: number;
  maxNumberOfImages?: number;
  fadeAnimation?: boolean;
}

/**
 * Renders a trail of images that follow the pointer as it moves across the
 * container. `className` fully controls the container's size/shape/position
 * — only `relative h-[600px] w-full rounded-lg` is applied as a fallback
 * default, so this component can be dropped into a fixed-size demo box *or*
 * stretched to fill an existing section (e.g. `className="absolute inset-0"`).
 *
 * Note: the positioning utility (`relative`/`absolute`/etc.) must come from
 * *either* the default *or* the override, never both — since this file uses
 * a plain classnames joiner (not tailwind-merge), having both `relative` and
 * `absolute` present at once would let Tailwind's fixed stylesheet order
 * (not the className string order) silently decide the winner.
 */
export default function ImageCursorTrail({
  items,
  children,
  className = "relative h-[600px] w-full rounded-lg",
  maxNumberOfImages = 5,
  imgClass = "w-40 h-48",
  distance = 20,
  fadeAnimation = false,
}: ImageMouseTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = useRef(items.map(() => createRef<HTMLImageElement>()));
  const currentZIndexRef = useRef(1);

  let globalIndex = 0;
  let last = { x: 0, y: 0 };

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const relativeX = x - containerRect.left;
    const relativeY = y - containerRect.top;
    image.style.left = `${relativeX}px`;
    image.style.top = `${relativeY}px`;

    if (currentZIndexRef.current > 40) {
      currentZIndexRef.current = 1;
    }
    image.style.zIndex = String(currentZIndexRef.current);
    currentZIndexRef.current++;

    image.dataset.status = "active";
    if (fadeAnimation) {
      setTimeout(() => {
        image.dataset.status = "inactive";
      }, 1500);
    }
    last = { x, y };
  };

  const distanceFromLast = (x: number, y: number) =>
    Math.hypot(x - last.x, y - last.y);

  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = "inactive";
  };

  const handleOnMove = (e: MouseEvent | Touch) => {
    if (distanceFromLast(e.clientX, e.clientY) > window.innerWidth / distance) {
      const lead = refs.current[globalIndex % refs.current.length].current;
      const tail =
        refs.current[(globalIndex - maxNumberOfImages) % refs.current.length]
          ?.current;
      if (lead) activate(lead, e.clientX, e.clientY);
      if (tail) deactivate(tail);
      globalIndex++;
    }
  };

  return (
    <section
      onMouseMove={(e) => handleOnMove(e as unknown as MouseEvent)}
      onTouchMove={(e) => handleOnMove(e.touches[0] as unknown as Touch)}
      ref={containerRef}
      className={cn("grid place-content-center overflow-hidden", className)}
    >
      {items.map((item, index) => (
        <img
          key={index}
          className={cn(
            "opacity:0 data-[status='active']:ease-out-expo absolute -translate-x-[50%] -translate-y-[50%] scale-0 rounded-3xl object-cover transition-transform duration-300 data-[status='active']:scale-100 data-[status='active']:opacity-100 data-[status='active']:duration-500",
            imgClass
          )}
          data-index={index}
          data-status="inactive"
          src={item}
          alt={`image-${index}`}
          ref={refs.current[index]}
        />
      ))}
      {children}
    </section>
  );
}
