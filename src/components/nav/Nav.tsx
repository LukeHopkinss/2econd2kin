"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart/useCart";
import { useCartUi } from "@/components/cart/CartUiContext";

const links = [
  { href: "/lookbook", label: "Lookbook" },
  { href: "/shop", label: "Shop" },
  { href: "/behind-the-scenes", label: "Behind the Scenes" },
  { href: "/about", label: "About" },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot";

export function Nav() {
  const [open, setOpen] = useState(false);
  const cartItems = useCart();
  const cartUi = useCartUi();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-ink/90 px-6 py-4 backdrop-blur-sm md:px-12">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className={`type-display text-2xl text-hot ${focusRing}`}
          onClick={() => setOpen(false)}
        >
          2ECOND2KIN
        </Link>
        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`type-meta text-meta text-paper transition-colors hover:text-hot ${focusRing}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={cartUi.open}
            aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className={`type-meta text-meta text-paper hover:text-hot ${focusRing}`}
          >
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            onClick={() => setOpen((v) => !v)}
            className={`type-meta text-meta text-paper hover:text-hot md:hidden ${focusRing}`}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile"
          className="mt-4 flex flex-col gap-4 border-t border-paper/20 pt-4 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`type-meta text-meta text-paper hover:text-hot ${focusRing}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
