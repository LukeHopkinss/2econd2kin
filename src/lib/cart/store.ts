"use client";

import type { CartItem } from "./types";

// A module-level external store backed by localStorage (persists across
// sessions — unlike the intro's sessionStorage gate, a cart should
// survive a closed tab), consumed via useSyncExternalStore in useCart().
// Not React state: this repo's ESLint config repeatedly rejects the
// read-from-external-source-on-mount-via-effect pattern
// (react-hooks/set-state-in-effect, hit and fixed four times earlier in
// this build — see the intro/lookbook sections of this log), and a cart
// that also needs cross-tab sync (the `storage` event) is exactly what
// useSyncExternalStore is for.
const STORAGE_KEY = "cart-items";
const listeners = new Set<() => void>();

// A fresh `[]` literal on every call is a different reference each time,
// which useSyncExternalStore treats as "the store changed" on every
// consistency check — React detects the resulting render loop and throws
// "The result of getServerSnapshot should be cached to avoid an infinite
// loop." One shared reference for the empty-cart case everywhere it's
// needed avoids that entirely.
const EMPTY_CART: CartItem[] = [];

let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_CART;

function readFromStorage(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  // getSnapshot must return a referentially stable value when nothing
  // changed, or useSyncExternalStore will believe the store is tearing
  // and re-render in a loop.
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    cachedItems = raw ? JSON.parse(raw) : EMPTY_CART;
  } catch {
    cachedItems = EMPTY_CART;
  }
  return cachedItems;
}

function writeToStorage(items: CartItem[]) {
  cachedItems = items;
  cachedRaw = JSON.stringify(items);
  window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  listeners.forEach((listener) => listener());
}

export function subscribeCart(callback: () => void) {
  listeners.add(callback);
  function onStorage(e: StorageEvent) {
    if (e.key === STORAGE_KEY) callback();
  }
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getCartSnapshot(): CartItem[] {
  return readFromStorage();
}

export function getCartServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function addToCart(item: CartItem) {
  const current = readFromStorage();
  const existingIndex = current.findIndex((i) => i.variantId === item.variantId);
  const next =
    existingIndex >= 0
      ? current.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      : [...current, item];
  writeToStorage(next);
}

export function removeFromCart(variantId: string) {
  writeToStorage(readFromStorage().filter((i) => i.variantId !== variantId));
}

export function setCartQuantity(variantId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(variantId);
    return;
  }
  writeToStorage(
    readFromStorage().map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
  );
}
