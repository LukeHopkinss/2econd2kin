import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <Section>
        <div className="grid gap-10 md:items-center md:gap-16">
          <div>
            <Badge tone="cyan">2econd2kin Magazine</Badge>
            <h1 className="mt-4 type-display text-display text-hot">About</h1>
            <p className="mt-6 max-w-[30ch] text-h1 font-bold leading-[1.05] text-paper">
              What we wear becomes an extension of who we are.
            </p>
            <p className="mt-6 max-w-[45ch] text-body text-paper">
              2econd2kin Magazine began as a passion project rooted in something I have always believed: what we wear can become an extension of who we are.
              Fashion can communicate identity, memory, emotion, culture, protection, transformation, and self-expression without ever needing to say a word. 
              The things we surround ourselves with; our clothes, music, art, photographs, obsessions, and influences can become so personal 
              that they almost feel like another layer of ourselves.

            </p>
          </div>
          <div className="relative aspect-[4/5] w-full max-w-sm justify-self-center overflow-hidden md:justify-self-end">
            <Image
              src="/about/hero.jpg"
              alt="Camila Peña Del Real, founder of 2econd2kin Magazine, seated on a Soho stoop"
              fill
              priority
              sizes="(min-width: 768px) 30vw, 80vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <div className="w-full bg-hot px-6 py-14 md:px-12 md:py-20">
        <p className="mx-auto mt-2 max-w-7xl type-display text-display text-paper">
          They become our second skin.
        </p>
      </div>

      <Section className="border-t border-paper/10">
        <Badge tone="violet">Founder &amp; Creative Director</Badge>
        <h2 className="mt-4 type-display text-h1 text-hot">Camila Peña Del Real</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-start md:gap-14">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/about/founder.jpg"
              alt="Camila Peña Del Real, Founder and Creative Director of 2econd2kin Magazine"
              fill
              sizes="(min-width: 768px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-[58ch] space-y-5 text-body text-paper">
            <p>
              I grew up dancing, telling stories before I had the words for them, and
              watching my mother transform herself through fashion, hair, and modeling.
              That&apos;s where this started.
            </p>
            <p>
              2econd2kin Magazine is an independent fashion, art, music, and culture
              publication built for emerging creatives; a place for photographers to meet
              designers, writers to meet musicians, and strangers to make something
              together.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-10 md:py-14">
        <p className="type-meta text-meta text-paper/60">
          Biannual: two physical issues a year, with digital stories and features in
          between.
        </p>
      </Section>
    </>
  );
}
