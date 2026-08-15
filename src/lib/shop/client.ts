import type { Product } from "./types";

// Headless Shopify Storefront API client — see build plan §6.
// Unset env vars means "no store connected yet": callers get an empty
// catalog instead of a crash, so /shop renders sanely pre-launch.
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const isConfigured = Boolean(domain && token);

async function storefrontFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  if (!domain || !token) {
    throw new Error("Shopify Storefront API is not configured");
  }
  // Next's `next.revalidate` fetch option only applies to GET requests —
  // the Storefront API is POST-only, so caching here has to happen at the
  // caller (route segment config / unstable_cache) once real queries exist.
  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify Storefront API error: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}

// TEMPORARY QA MOCK — remove before real use.
const QA_MOCK_PRODUCT: Product = {
  handle: "qa-test-tee",
  title: "QA Test Tee",
  description: "Temporary mock product for manual shop-flow QA.",
  images: [
    {
      src: "https://placehold.co/800x1000/ff00b0/000000.png?text=FRONT",
      alt: "QA test tee, front",
      under: "https://placehold.co/800x1000/00ffe8/000000.png?text=BACK",
      underAlt: "QA test tee, back",
    },
    {
      src: "https://placehold.co/800x1000/cc00ff/000000.png?text=DETAIL",
      alt: "QA test tee, detail",
      under: "https://placehold.co/800x1000/f2ff00/000000.png?text=DETAIL2",
      underAlt: "QA test tee, detail alt",
    },
  ],
  variants: [
    { id: "v-s", title: "S", available: true, price: { amount: "45.00", currencyCode: "USD" } },
    { id: "v-m", title: "M", available: true, price: { amount: "45.00", currencyCode: "USD" } },
    { id: "v-l", title: "L", available: false, price: { amount: "45.00", currencyCode: "USD" } },
  ],
};

export async function getProducts(): Promise<Product[]> {
  if (!isConfigured) return [QA_MOCK_PRODUCT];
  // TODO: replace with a real Storefront API query once the store exists.
  return [];
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isConfigured) return handle === QA_MOCK_PRODUCT.handle ? QA_MOCK_PRODUCT : null;
  // TODO: replace with a real Storefront API query once the store exists.
  return null;
}

export { isConfigured as isShopConfigured, storefrontFetch };
