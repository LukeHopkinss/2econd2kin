import { IntroGateway } from "@/components/intro/IntroGateway";
import { Section } from "@/components/ui/Section";

export default function Home() {
  return (
    <>
      <IntroGateway />

      <Section className="flex min-h-[80vh] flex-col justify-center">
        <h1 className="type-display text-display text-hot md:whitespace-nowrap md:text-[clamp(1.5rem,6vw,5rem)]">
          2ECOND2KIN MAGAZINE
        </h1>
        <p className="mt-10 max-w-[45ch] text-body text-paper font-bold">
          2econd2kin Magazine is an independent fashion, art, music, media, and culture publication exploring the things that become part of us.
        </p>

        <p className="mt-6 max-w-[75ch] text-body text-paper">
          Built for emerging creatives and curious minds, 2econd2kin Magazine is more than a magazine. It is a growing creative community centered around storytelling, collaboration, discovery, and self-expression.
        </p>
      </Section>
    </>
  );
}
