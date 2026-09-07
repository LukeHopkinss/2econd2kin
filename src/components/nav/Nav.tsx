"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart/useCart";
import { useCartUi } from "@/components/cart/CartUiContext";

// Each link hovers to a different brand color rather than sharing one
// hover state — the palette (hot/acid/cyan/violet) has exactly four
// colors, which conveniently matches the four nav links. Applied as a
// background chip with black text, not colored text on white: acid and
// cyan as raw foreground text on a white canvas are nearly unreadable
// (see globals.css's palette comment) — a filled chip keeps all four
// colors distinct and legible instead of quietly dropping two of them.
const links = [
  { href: "/lookbook", label: "Lookbook", hoverClass: "hover:bg-hot" },
  { href: "/behind-the-scenes", label: "Behind the Scenes", hoverClass: "hover:bg-violet" },
  { href: "/about", label: "About", hoverClass: "hover:bg-cyan" },
  { href: "/shop", label: "Shop", hoverClass: "hover:bg-acid" },
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
          2ECOND2KIN MAGAZINE
        </Link>
        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-block -mx-1 px-1 type-meta text-meta text-paper transition-colors hover:text-paper ${link.hoverClass} ${focusRing}`}
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
              className={`inline-block -mx-1 px-1 type-meta text-meta text-paper transition-colors hover:text-paper ${link.hoverClass} ${focusRing}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
