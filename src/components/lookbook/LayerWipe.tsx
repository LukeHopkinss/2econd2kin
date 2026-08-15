"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useSyncExternalStore, type PointerEvent } from "react";

const COARSE_POINTER_QUERY = "(hover: none)";

function subscribeCoarsePointer(callback: () => void) {
  const mql = window.matchMedia(COARSE_POINTER_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getCoarsePointerSnapshot(): boolean {
  return window.matchMedia(COARSE_POINTER_QUERY).matches;
}

function getCoarsePointerServerSnapshot(): boolean {
  return false;
}

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
// - Touch (coarse pointer, no hover): tied to the image's own scroll
//   position through the viewport instead — there's no hover to drive it.
// - prefers-reduced-motion: top layer only, no interaction at all.
export function LayerWipe({ src, alt, under, underAlt, sizes, priority = false }: LayerWipeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isCoarsePointer = useSyncExternalStore(
    subscribeCoarsePointer,
    getCoarsePointerSnapshot,
    getCoarsePointerServerSnapshot,
  );
  const reducedMotion = useReducedMotion();
  const pointerWipe = useMotionValue(0);

  // Called unconditionally regardless of pointer type — only which of
  // this and `pointerWipe` actually drives the style below is
  // conditional, never the hook call itself.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Compresses the tracked range to roughly the middle third of the
    // scroll-through instead of the full enter-to-exit span, so the wipe
    // completes while the image is actually centered and visible rather
    // than as it's scrolling out of view.
    offset: ["start 0.8", "end 0.2"],
  });
  const scrollClipPath = useTransform(scrollYProgress, (v) => `inset(0 0 0 ${v * 100}%)`);
  const pointerClipPath = useMotionTemplate`inset(0 0 0 ${pointerWipe}%)`;

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (isCoarsePointer) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    pointerWipe.set(Math.max(0, Math.min(100, x)));
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
      onPointerLeave={() => pointerWipe.set(0)}
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
        style={{
          clipPath: isCoarsePointer ? scrollClipPath : pointerClipPath,
          transition: isCoarsePointer ? undefined : "clip-path 120ms linear",
        }}
      >
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </motion.div>
    </div>
  );
}
