import type { Product } from "./types";

// Static catalog — no external commerce platform. Checkout happens
// through Stripe (see src/app/api/checkout/route.ts), which only needs
// a price and a description at session-creation time, not a hosted
// product catalog. Swap/extend this list directly when real issues or
// merch are ready.
//
// PLACEHOLDER CONTENT — replace title/description/price/images with the
// real issue details.
const ISSUE_PILOT: Product = {
  handle: "issue-01-pilot",
  title: "Issue 01 — 'Pilot'",
  description: "The debut issue. Triannual, from wherever we're standing.",
  images: [
    {
      src: "/shop/issue-01-cover.png",
      alt: "Issue 01, 'Pilot' — cover",
      under: "https://placehold.co/800x1000/00ffe8/000000.png?text=BACK+COVER",
      underAlt: "Issue 01, 'Pilot' — back cover",
    },
  ],
  variants: [
    {
      id: "issue-01-pilot",
      title: "Issue 01",
      available: true,
      price: { amount: "40.00", currencyCode: "USD" },
    },
  ],
};

const PRODUCTS: Product[] = [ISSUE_PILOT];

// Checkout is gated on this rather than catalog presence — the shop
// page should always show the issue, but the checkout button should
// only go live once Stripe is actually connected.
const isConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export async function getProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProduct(handle: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.handle === handle) ?? null;
}

export { isConfigured as isShopConfigured };
