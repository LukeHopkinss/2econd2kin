import Link from "next/link";
import Image from "next/image";
import { IntroGateway } from "@/components/intro/IntroGateway";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { getProducts } from "@/lib/shop/client";
import { lookbook } from "@/content/lookbook";

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 4);
  const latestLooks = lookbook.slice(0, 4);

  return (
    <>
      <IntroGateway />

      <Section className="flex min-h-[80vh] flex-col justify-center">
        <h1 className="type-display text-display text-hot">2ECOND2KIN</h1>
        <p className="mt-6 max-w-[45ch] text-body text-paper">
          Clothing as a layer worn against the body.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/shop" variant="solid">
            Shop
          </Button>
          <Button href="/lookbook" variant="outline">
            Lookbook
          </Button>
        </div>
      </Section>

      <Reveal>
        <Section>
          <h2 className="type-display text-h1 text-cyan">Featured</h2>
          {featured.length === 0 ? (
            <p className="mt-8 type-meta text-meta text-paper/60">Coming soon</p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              {featured.map((product) => {
                const inStock = product.variants.some((v) => v.available);
                const image = product.images[0];
                return (
                  <Link
                    key={product.handle}
                    href={`/shop/${product.handle}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] w-full bg-paper/5">
                      {image && (
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 768px) 25vw, 50vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <p className="mt-3 type-meta text-meta text-paper group-hover:text-hot">
                      {product.title}
                    </p>
                    <Badge tone={inStock ? "cyan" : "acid"}>
                      {inStock ? "In Stock" : "Sold Out"}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </Section>
      </Reveal>

      <Reveal>
        <Section>
          <div className="flex items-baseline justify-between">
            <h2 className="type-display text-h1 text-cyan">Lookbook</h2>
            <Button href="/lookbook" variant="ghost">
              View all
            </Button>
          </div>
          {latestLooks.length === 0 ? (
            <p className="mt-8 type-meta text-meta text-paper/60">Coming soon</p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
              {latestLooks.map((shot) => (
                <div key={shot.src} className="relative aspect-[3/4] w-full bg-paper/5">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </Section>
      </Reveal>
    </>
  );
}
