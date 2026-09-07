"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Shot } from "@/content/lookbook";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// A handful of cells run wide for rhythm — same "some images intentionally
// small(er)" idea as the Behind the Scenes grid, tuned to a 3/4-col grid
// instead of BTS's 2/4-col one.
const wideIndexes = new Set([3, 7, 11, 15, 19, 23]);

export function LookbookGallery({ shots }: { shots: Shot[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? i : (i + delta + shots.length) % shots.length)),
    [shots.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowRight") {
        step(1);
        return;
      }
      if (e.key === "ArrowLeft") {
        step(-1);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close, step]);

  const active = openIndex !== null ? shots[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {shots.map((shot, i) => {
          const wide = wideIndexes.has(i);
          return (
            <button
              key={shot.src}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Enlarge: ${shot.alt}`}
              className={`relative aspect-[3/4] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot ${wide ? "sm:col-span-2 sm:aspect-[3/2]" : ""}`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                priority={i < 2}
                sizes={
                  wide
                    ? "(min-width: 1024px) 50vw, (min-width: 640px) 66vw, 100vw"
                    : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                }
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isOpen && active && (
          <>
            <motion.button
              type="button"
              aria-label="Close enlarged image"
              onClick={close}
              className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={active.alt}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-10 md:px-16"
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
              transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              <div className="relative w-full max-w-5xl min-h-0 flex-1">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="absolute right-4 top-4 bg-ink px-3 py-2 type-meta text-meta text-paper hover:text-hot focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan md:right-6 md:top-6"
              >
                Close ✕
              </button>

              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-ink px-3 py-2 type-display text-2xl text-paper hover:text-hot focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan md:left-6"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-ink px-3 py-2 type-display text-2xl text-paper hover:text-hot focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan md:right-6"
              >
                →
              </button>

              <p className="mt-4 type-meta text-meta text-paper/60">
                {openIndex + 1} / {shots.length}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
