import Image from "next/image";
import Link from "next/link";
import { IntroGateway } from "@/components/intro/IntroGateway";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const featuredShots = [
  { src: "/lookbook/08.jpg", alt: "FaurY climbing a fire escape ladder against a graffiti wall" },
  { src: "/lookbook/02.jpg", alt: "Two models in 2econd2kin Magazine tees posed in a brownstone doorway" },
  { src: "/lookbook/23.jpg", alt: "FaurY standing mid-street holding a bag" },
];

export default function Home() {
  return (
    <>
      <IntroGateway />

      <Section className="flex min-h-[80vh] flex-col justify-center">
        <h1 className="type-display text-display text-hot md:whitespace-nowrap md:text-[clamp(1.5rem,6vw,5rem)]">
          2ECOND2KIN
        </h1>
        <p className="mt-10 max-w-[45ch] text-body text-paper font-bold">
          Not just a magazine, it&apos;s a second skin.
        </p>
      </Section>

      <Section className="border-t border-paper/10 pt-12">
        <p className="type-meta text-meta text-paper/60">Issue 01</p>
        <h2 className="mt-2 type-display text-h1 text-hot">Party Like It&apos;s 1999</h2>

        <Link
          href="/lookbook"
          className="mt-8 grid grid-cols-3 gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot md:gap-4"
        >
          {featuredShots.map((shot) => (
            <div key={shot.src} className="group relative aspect-[3/4] overflow-hidden">
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 768px) 33vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </Link>

        <Button href="/lookbook" className="mt-8">
          View the Lookbook
        </Button>
      </Section>
    </>
  );
}
