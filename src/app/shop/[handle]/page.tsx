import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/shop/client";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  return { title: product ? product.title : "Product" };
}

// Shop is covered for this iteration — product pages stay unreachable
// even by direct link. See src/app/shop/page.tsx.
export default function ProductPage() {
  notFound();
}
