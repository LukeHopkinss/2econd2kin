"use client";

import Image from "next/image";
import { useState } from "react";
import { LayerWipe } from "@/components/lookbook/LayerWipe";
import { Badge } from "@/components/ui/Badge";
import { addToCart } from "@/lib/cart/useCart";
import { useCartUi } from "@/components/cart/CartUiContext";
import type { Product } from "@/lib/shop/types";

type Side = "front" | "back";

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  // Which side is on top by default; the LayerWipe slide interaction still
  // lets you hover/scroll past it to peek at the other side either way.
  const [side, setSide] = useState<Side>("front");
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => product.variants.find((v) => v.available)?.id ?? product.variants[0]?.id,
  );
  const cartUi = useCartUi();

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const inStock = selectedVariant?.available ?? false;
  const image = product.images[activeImage];
  const shown =
    side === "front"
      ? { src: image?.src, alt: image?.alt, under: image?.under, underAlt: image?.underAlt }
      : { src: image?.under, alt: image?.underAlt, under: image?.src, underAlt: image?.alt };

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
        {image && shown.src && shown.under && (
          <LayerWipe
            // Remount on side change so the wipe resets to fully showing
            // whichever side was just picked, instead of carrying over
            // wherever the pointer last left the clip.
            key={`${activeImage}-${side}`}
            src={shown.src}
            alt={shown.alt ?? ""}
            under={shown.under}
            underAlt={shown.underAlt ?? ""}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        )}

        {image && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setSide("front")}
              aria-pressed={side === "front"}
              className={`relative h-16 w-16 border ${side === "front" ? "border-hot" : "border-paper/30"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot`}
            >
              <Image src={image.src} alt="" fill sizes="64px" className="object-cover" />
              <span className="sr-only">Show front</span>
            </button>
            <button
              type="button"
              onClick={() => setSide("back")}
              aria-pressed={side === "back"}
              className={`relative h-16 w-16 border ${side === "back" ? "border-hot" : "border-paper/30"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot`}
            >
              <Image src={image.under} alt="" fill sizes="64px" className="object-cover" />
              <span className="sr-only">Show back</span>
            </button>
          </div>
        )}

        {product.images.length > 1 && (
          <div className="mt-2 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => {
                  setActiveImage(i);
                  setSide("front");
                }}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === activeImage}
                className={`h-2 w-2 rounded-full ${i === activeImage ? "bg-hot" : "bg-paper/30"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot`}
              />
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

        {product.variants.length > 1 && (
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
                      ? "border-hot bg-hot text-paper"
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
          className="mt-8 w-full bg-hot px-6 py-3 type-meta text-meta text-paper transition-colors hover:bg-violet focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot disabled:cursor-not-allowed disabled:bg-paper/20 disabled:text-paper/50 md:w-auto"
        >
          {inStock ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
