import { IntroGateway } from "@/components/intro/IntroGateway";
import { Section } from "@/components/ui/Section";

export default function Home() {
  return (
    <>
      <IntroGateway />

      <Section className="flex min-h-[80vh] flex-col justify-center">
        <h1 className="type-display text-display text-hot">2ECOND2KIN</h1>
        <p className="mt-6 max-w-[45ch] text-body text-paper">
          Not just a magazine, it&apos;s a second skin.
        </p>
      </Section>
    </>
  );
}
