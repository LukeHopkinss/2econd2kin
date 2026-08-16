"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart, removeFromCart, setCartQuantity } from "@/lib/cart/useCart";
import { useCartUi } from "./CartUiContext";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// shopConfigured comes from the server (layout.tsx reads
// process.env.STRIPE_SECRET_KEY) rather than being checked in this
// module directly — a "use client" component's bundle has no server
// env, so a secret-backed check here would always read as false.
export function CartSlideOver({ shopConfigured }: { shopConfigured: boolean }) {
  const { isOpen, close } = useCartUi();
  const items = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price.amount) * item.quantity, 0);
  const currencyCode = items[0]?.price.currencyCode ?? "USD";

  async function handleCheckout() {
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Checkout request failed");
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch {
      setCheckoutError("Checkout failed — please try again.");
      setIsCheckingOut(false);
    }
  }

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
      console.error("DEBUG onKey fired:", e.key, "isTrusted:", e.isTrusted);
      if (e.key === "Escape") {
        console.error("DEBUG calling close()");
        close();
        console.error("DEBUG close() returned");
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
              {items.length === 0 ? (
                <p className="type-meta text-meta text-paper/60">Your cart is empty</p>
              ) : (
                <ul className="flex flex-col gap-6">
                  {items.map((item) => (
                    <li key={item.variantId} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 bg-paper/5">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="type-meta text-meta text-paper">{item.productTitle}</p>
                        <p className="type-meta text-meta text-paper/60">{item.variantTitle}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <label className="sr-only" htmlFor={`qty-${item.variantId}`}>
                            Quantity
                          </label>
                          <input
                            id={`qty-${item.variantId}`}
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              setCartQuantity(item.variantId, Number(e.target.value))
                            }
                            className="w-16 border border-paper/40 bg-transparent px-2 py-1 type-meta text-meta text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-hot"
                          />
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variantId)}
                            className="type-meta text-meta text-paper/60 hover:text-hot focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="type-meta text-meta text-paper">
                        {item.price.currencyCode} {(Number(item.price.amount) * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-paper/20 px-6 py-4">
              <div className="flex items-center justify-between type-meta text-meta text-paper">
                <span>Subtotal</span>
                <span>
                  {currencyCode} {subtotal.toFixed(2)}
                </span>
              </div>
              {checkoutError && (
                <p className="mb-2 type-meta text-meta text-hot">{checkoutError}</p>
              )}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={items.length === 0 || !shopConfigured || isCheckingOut}
                className="mt-4 w-full bg-hot px-6 py-3 type-meta text-meta text-paper transition-colors hover:bg-violet disabled:cursor-not-allowed disabled:bg-paper/20 disabled:text-paper/50"
              >
                {!shopConfigured
                  ? "Checkout (store not connected yet)"
                  : isCheckingOut
                    ? "Redirecting…"
                    : "Checkout"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
