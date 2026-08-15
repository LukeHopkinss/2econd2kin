"use client";

import { useSyncExternalStore } from "react";
import { getCartServerSnapshot, getCartSnapshot, subscribeCart } from "./store";
import type { CartItem } from "./types";

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
}

export { addToCart, removeFromCart, setCartQuantity } from "./store";
