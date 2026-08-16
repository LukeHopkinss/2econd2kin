import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { SwingingImage } from "@/components/shop/SwingingImage";
import { getProducts } from "@/lib/shop/client";

export const metadata: Metadata = {
  title: "Shop",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <Section>
      <h1 className="type-display text-h1 text-hot">Shop</h1>
      {products.length === 0 ? (
        <p className="mt-8 type-meta text-meta text-paper/60">Coming soon</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const inStock = product.variants.some((v) => v.available);
            const image = product.images[0];
            return (
              <Link key={product.handle} href={`/shop/${product.handle}`} className="group block">
                {image && (
                  <SwingingImage
                    src={image.src}
                    alt={image.alt}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
                )}
                <p className="mt-3 type-meta text-meta text-paper group-hover:text-hot">
                  {product.title}
                </p>
                <Badge tone={inStock ? "cyan" : "acid"}>{inStock ? "In Stock" : "Sold Out"}</Badge>
              </Link>
            );
          })}
        </div>
      )}
    </Section>
  );
}
