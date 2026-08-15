import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { getProduct } from "@/lib/shop/client";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  return { title: product ? product.title : "Product" };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  return (
    <Section>
      <ProductDetail product={product} />
    </Section>
  );
}
