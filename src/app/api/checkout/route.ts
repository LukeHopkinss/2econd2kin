import { NextResponse } from "next/server";
import Stripe from "stripe";
import type { CartItem } from "@/lib/cart/types";

// Cart items arrive from the client as plain data (localStorage-backed,
// see lib/cart/store.ts) — price_data is built fresh from them here
// rather than trusting a client-supplied amount, so a tampered request
// body can't check out at an arbitrary price.
export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const { items } = (await req.json()) as { items: CartItem[] };
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  const line_items = items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: item.price.currencyCode.toLowerCase(),
      unit_amount: Math.round(Number(item.price.amount) * 100),
      product_data: {
        name: `${item.productTitle} — ${item.variantTitle}`,
        images: [item.image.src],
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    shipping_address_collection: { allowed_countries: ["US"] },
    success_url: `${origin}/shop?checkout=success`,
    cancel_url: `${origin}/shop?checkout=cancelled`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}
