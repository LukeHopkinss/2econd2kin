"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { useRef, type PointerEvent } from "react";

type LayerWipeProps = {
  src: string;
  alt: string;
  under: string;
  underAlt: string;
  /** Matches the calling grid's actual column layout — see plan §5's
   * warning that lookbook/shop pages are otherwise "your Lighthouse
   * problem." No sane one-size-fits-all default across callers. */
  sizes: string;
  priority?: boolean;
};

// The site's one signature interaction (build plan §3.4), reusable for
// both lookbook shots and product images per the plan's own wording.
// Every image is two stacked layers. Moving the pointer across it wipes
// the top layer away to reveal the second — a hard-edged clip-path cut
// that follows the pointer, not a crossfade, so it reads as something
// being peeled back rather than a dissolve.
//
// - Pointer devices: clip position tracks the cursor directly, driven by
//   a MotionValue (not React state) so pointermove doesn't re-render the
//   component on every event.
// - Touch: pointer events fire for touch too, so the same handler tracks
//   a horizontal drag across the image. `touch-action: pan-y` leaves
//   vertical drags to the browser (page scroll) and only hands us
//   horizontal movement, so the wipe doesn't fight scrolling.
// - prefers-reduced-motion: top layer only, no interaction at all.
export function LayerWipe({ src, alt, under, underAlt, sizes, priority = false }: LayerWipeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const wipe = useMotionValue(0);
  const clipPath = useMotionTemplate`inset(0 0 0 ${wipe}%)`;

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    wipe.set(Math.max(0, Math.min(100, x)));
  }

  if (reducedMotion) {
    return (
      <div ref={containerRef} className="relative aspect-[3/4] w-full overflow-hidden">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => wipe.set(0)}
      style={{ touchAction: "pan-y" }}
      className="relative aspect-[3/4] w-full overflow-hidden"
    >
      <Image
        src={under}
        alt={underAlt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
      <motion.div
        className="absolute inset-0"
        style={{ clipPath, transition: "clip-path 120ms linear" }}
      >
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </motion.div>
    </div>
  );
}
