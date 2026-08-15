export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductVariant = {
  id: string;
  title: string; // e.g. "S", "M", "L"
  available: boolean;
  price: Money;
};

export type ProductImage = {
  src: string;
  alt: string;
  /** second-layer image for the LayerWipe interaction — plan §3.4 covers
   * "every lookbook and product image", not lookbook alone. */
  under: string;
  underAlt: string;
};

export type Product = {
  handle: string;
  title: string;
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
};
