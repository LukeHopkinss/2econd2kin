import type { Money } from "@/lib/shop/types";

export type CartItem = {
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  price: Money;
  image: { src: string; alt: string };
  quantity: number;
};
