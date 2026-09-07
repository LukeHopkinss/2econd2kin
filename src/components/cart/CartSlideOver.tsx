"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useCartUi } from "./CartUiContext";
import { QuestionMarkCover } from "@/components/ui/QuestionMarkCover";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Covered for this iteration — real cart contents (useCart, checkout)
// stay wired up in lib/cart and api/checkout, just not rendered here.
export function CartSlideOver() {
  const { isOpen, close } = useCartUi();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (window as unknown as { __cartIsOpen: boolean }).__cartIsOpen = isOpen;
  });

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
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
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={close}
            className="fixed inset-0 z-40 bg-ink/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
            }}
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-paper/20 bg-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-paper/20 px-6 py-4">
              <h2 className="type-display text-2xl text-hot">Cart</h2>
              <button
                type="button"
                onClick={close}
                className="type-meta text-meta text-paper hover:text-hot focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <QuestionMarkCover />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
