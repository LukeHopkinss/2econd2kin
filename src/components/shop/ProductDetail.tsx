"use client";

import { useState } from "react";
import { LayerWipe } from "@/components/lookbook/LayerWipe";
import { Badge } from "@/components/ui/Badge";
import { addToCart } from "@/lib/cart/useCart";
import { useCartUi } from "@/components/cart/CartUiContext";
import type { Product } from "@/lib/shop/types";

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => product.variants.find((v) => v.available)?.id ?? product.variants[0]?.id,
  );
  const cartUi = useCartUi();

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const inStock = selectedVariant?.available ?? false;
  const image = product.images[activeImage];

  function handleAddToCart() {
    if (!selectedVariant || !image) return;
    addToCart({
      variantId: selectedVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      image: { src: image.src, alt: image.alt },
      quantity: 1,
    });
    cartUi.open();
  }

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <div>
        {image && (
          <LayerWipe
            src={image.src}
            alt={image.alt}
            under={image.under}
            underAlt={image.underAlt}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        )}
        {product.images.length > 1 && (
          <div className="mt-4 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === activeImage}
                className={`h-16 w-16 border ${i === activeImage ? "border-hot" : "border-paper/30"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot`}
              >
                <span className="sr-only">Image {i + 1}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="type-display text-h1 text-hot">{product.title}</h1>
        <div className="mt-4">
          <Badge tone={inStock ? "cyan" : "acid"}>{inStock ? "In Stock" : "Sold Out"}</Badge>
        </div>
        <p className="mt-6 max-w-[45ch] text-body text-paper">{product.description}</p>

        {product.variants.length > 0 && (
          <fieldset className="mt-8">
            <legend className="type-meta text-meta text-paper/60">Size</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!variant.available}
                  onClick={() => setSelectedVariantId(variant.id)}
                  aria-pressed={variant.id === selectedVariantId}
                  className={`border px-4 py-2 type-meta text-meta transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot ${
                    variant.id === selectedVariantId
                      ? "border-hot bg-hot text-ink"
                      : "border-paper/40 text-paper hover:border-hot hover:text-hot"
                  } ${!variant.available ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="mt-8 w-full bg-hot px-6 py-3 type-meta text-meta text-ink transition-colors hover:bg-violet focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot disabled:cursor-not-allowed disabled:bg-paper/20 disabled:text-paper/50 md:w-auto"
        >
          {inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
