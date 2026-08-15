import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <Section>
      <div className="mx-auto max-w-[65ch]">
        <h1 className="type-display text-h1 text-hot">About</h1>
        <p className="mt-8 text-body text-paper">
          2econd2kin is coming soon. This page holds the brand story — resist the urge to
          make it loud; the contrast with the rest of the site is what makes it read as
          sincere.
        </p>
      </div>
    </Section>
  );
}
