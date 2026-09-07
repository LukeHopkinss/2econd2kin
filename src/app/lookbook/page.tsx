import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { LookbookGallery } from "@/components/lookbook/LookbookGallery";
import { lookbook } from "@/content/lookbook";

export const metadata: Metadata = {
  title: "Lookbook",
};

export default function LookbookPage() {
  return (
    <>
      <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden md:h-[90vh]">
        <Image
          src="/lookbook/hero.jpg"
          alt="FaurY climbing a fire escape ladder against a graffiti wall in Soho"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/40 to-transparent px-6 pb-8 pt-24 md:px-12 md:pb-14">
          <Badge tone="cyan">Issue 01</Badge>
          <h1 className="mt-3 type-display text-display text-hot">Party Like It&apos;s 1999</h1>
        </div>
      </div>

      <Section className="pb-0">
        <div className="max-w-[60ch]">
          <p className="text-body text-paper">
            Step inside the visual world of <em>Party Like It&apos;s 1999</em> — the
            imagery, styling, and nostalgia behind Issue 01 of 2econd2kin Magazine.
          </p>
          <p className="mt-2 type-meta text-meta text-paper/60">
            Look around. Stay awhile. Enjoy. ♡
          </p>
        </div>
      </Section>

      {lookbook.length === 0 ? (
        <Section className="pt-8">
          <p className="type-meta text-meta text-paper/60">Coming soon</p>
        </Section>
      ) : (
        <Section className="pt-8">
          <LookbookGallery shots={lookbook} />
        </Section>
      )}

      <Section className="border-t border-paper/10 pt-12">
        <p className="type-meta text-meta text-paper/60">Credits</p>
        <dl className="mt-4 grid max-w-[60ch] gap-x-12 gap-y-4 text-body text-paper sm:grid-cols-2">
          <div>
            <dt className="type-meta text-meta text-paper/60">Model</dt>
            <dd>Faury Franco</dd>
          </div>
          <div>
            <dt className="type-meta text-meta text-paper/60">Artist</dt>
            <dd>FaurY</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="type-meta text-meta text-paper/60">Publication</dt>
            <dd>2econd2kin Magazine — Issue 01: Party Like It&apos;s 1999</dd>
          </div>
        </dl>
        <p className="mt-6 max-w-[60ch] text-body text-paper/80">
          Faury Franco is an aspiring rapper performing under the name FaurY, also
          featured inside Issue 01 of 2econd2kin Magazine.
        </p>
      </Section>
    </>
  );
}
