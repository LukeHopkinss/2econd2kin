import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "hot", className: "bg-hot" },
  { name: "acid", className: "bg-acid" },
  { name: "cyan", className: "bg-cyan" },
  { name: "violet", className: "bg-violet" },
  { name: "paper", className: "bg-paper" },
  { name: "ink", className: "bg-ink border border-paper/40" },
] as const;

export default function StyleguidePage() {
  return (
    <>
      <Section>
        <h1 className="type-display text-h1 text-hot">Styleguide</h1>
      </Section>

      <Section>
        <h2 className="type-display text-h1 text-cyan">Colors</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {swatches.map((s) => (
            <div key={s.name}>
              <div className={`h-24 w-full ${s.className}`} />
              <p className="mt-2 type-meta text-meta">{s.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <h2 className="type-display text-h1 text-cyan">Type</h2>
        <p className="type-display text-display text-hot">Display</p>
        <p className="mt-4 type-display text-h1">Heading 1</p>
        <p className="mt-4 max-w-[65ch] text-body">
          Body text sits on Public Sans — neutral, wide-ish, deliberately gets out of
          Antonio&apos;s way. It should stay readable at paragraph length.
        </p>
        <p className="mt-4 type-meta text-meta">Meta / utility label</p>
      </Section>

      <Section>
        <h2 className="type-display text-h1 text-cyan">Buttons</h2>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/shop" variant="solid">
            Shop
          </Button>
          <Button href="/lookbook" variant="outline">
            Lookbook
          </Button>
          <Button href="/about" variant="ghost">
            About
          </Button>
        </div>
      </Section>

      <Section>
        <h2 className="type-display text-h1 text-cyan">Badges</h2>
        <div className="mt-8 flex flex-wrap gap-4">
          <Badge tone="cyan">In Stock</Badge>
          <Badge tone="acid">Sold Out</Badge>
          <Badge tone="hot">New</Badge>
          <Badge tone="violet">Limited</Badge>
        </div>
      </Section>
    </>
  );
}
