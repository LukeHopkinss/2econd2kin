import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section className="flex min-h-[60vh] flex-col justify-center">
      <h1 className="type-display text-display text-hot">404</h1>
      <p className="mt-6 max-w-[45ch] text-body text-paper">
        This page doesn&apos;t exist, or it moved.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Button href="/" variant="solid">
          Home
        </Button>
        <Button href="/shop" variant="outline">
          Shop
        </Button>
      </div>
    </Section>
  );
}
