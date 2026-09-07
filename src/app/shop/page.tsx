import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { QuestionMarkCover } from "@/components/ui/QuestionMarkCover";

export const metadata: Metadata = {
  title: "Shop",
};

// Not wired to the real catalog for this iteration — a covered
// placeholder regardless of what's in the catalog, rather than the
// product grid. See src/lib/shop/client.ts for the real data.
export default function ShopPage() {
  return (
    <Section>
      <h1 className="type-display text-h1 text-hot">Shop</h1>
      <QuestionMarkCover className="mt-8" />
    </Section>
  );
}
