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
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div>
            <Badge tone="cyan">2econd2kin Magazine</Badge>
            <h1 className="mt-4 type-display text-display text-hot">About</h1>
            <div className="mt-10 max-w-[70ch] space-y-5 text-body text-paper">
              <p>
                2econd2kin Magazine began as a passion project rooted in something I have always believed: what we wear can become an extension of who we are.
              </p>
              <p>
                Fashion can communicate identity, memory, emotion, culture, protection, transformation, and self-expression without ever needing to say a word.
                The things we surround ourselves with; our clothes, music, art, photographs, obsessions, and influences can become so personal
                that they almost feel like another layer of ourselves.
              </p>
              <p>A second skin.</p>
              <p>
                The idea for 2econd2kin Magazine first began taking shape during my freshman year of college, but in many ways, it had been developing long before I ever had a name for it.
              </p>
              <p>
                Creativity has always been a huge part of my life. I grew up dancing and trained in styles including ballet, jazz, hip hop, and lyrical. Dance was one of the first ways I learned how to tell a story without speaking. Through movement, costumes, music, performance, and character, I became fascinated with all of the different ways we can communicate who we are.
              </p>
              <p>
                That eventually grew into an even deeper love for fashion, art, media, music, and visual storytelling.
              </p>
              <p>
                My mother has also always been one of my greatest inspirations. Growing up around her relationship with fashion, modeling, and hairstyling influenced the way I viewed clothing, beauty, confidence, and personal style from a young age. She showed me how transformative fashion could be and how much of yourself can exist in the way you present yourself to the world.
              </p>
              <p>
                All of those influences eventually became part of the world I wanted to create with 2econd2kin Magazine.
              </p>
              <p>
                2econd2kin Magazine is an independent fashion, art, music, media, and culture publication built around creativity, curiosity, individuality, and community.
              </p>
              <p>
                It is a place for emerging creatives to be seen, for people to discover something or someone new, and for artists across different mediums to collaborate with one another.
              </p>
              <p>
                I want photographers to meet designers. Writers to discover musicians. Stylists to meet models. Artists to inspire other artists.
              </p>
              <p>
                I want someone to open 2econd2kin Magazine and leave wanting to make something.
              </p>
              <p>
                More than anything, I never wanted 2econd2kin Magazine to exist as just another publication.
              </p>
              <p>
                The goal is to build a creative universe around it; through physical issues, digital stories, photography, fashion, music, events, interviews, collaborations, community conversations, and whatever else it grows into.
              </p>
              <p>
                2econd2kin Magazine is still evolving, and I want it to continue evolving alongside the people who become part of it.
              </p>
              <p>
                Because the things we love, create, wear, listen to, and surround ourselves with eventually become pieces of us.
              </p>
              <p>They become our second skin.</p>
            </div>
          </div>
          <div className="grid w-full max-w-md gap-6 justify-self-center md:max-w-none md:h-full md:grid-rows-4 md:justify-self-end">
            <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full">
              <Image
                src="/about/hero.jpg"
                alt="Camila Peña Del Real, founder of 2econd2kin Magazine, seated on a Soho stoop"
                fill
                priority
                sizes="(min-width: 768px) 30vw, 80vw"
                className="object-cover object-top"
              />
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full">
              <Image
                src="/2econd-drive/MISC(1).jpg"
                alt="Two team members in 'Founder' and 'Social Media Manager' 2econd2kin tees in a brownstone doorway"
                fill
                sizes="(min-width: 768px) 30vw, 80vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full">
              <Image
                src="/2econd-drive/GRAPHIC.jpg"
                alt="2econd2kin sticker sheet held over pavement"
                fill
                sizes="(min-width: 768px) 30vw, 80vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full">
              <Image
                src="/2econd-drive/GRAPHIC(2).jpg"
                alt="2econd2kin sticker on a boot sole"
                fill
                sizes="(min-width: 768px) 30vw, 80vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      <div className="w-full bg-hot px-6 py-14 md:px-12 md:py-20">
        <p className="mx-auto mt-2 max-w-7xl type-display text-display text-paper">
          What&apos;s your second skin?
        </p>
      </div>

      <Section className="border-t border-paper/10">
        <Badge tone="violet">Founder &amp; Creative Director</Badge>
        <h2 className="mt-4 type-display text-h1 text-hot">Camila Peña Del Real</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-14">
          <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full">
            <Image
              src="/about/founder.jpg"
              alt="Camila Peña Del Real, Founder and Creative Director of 2econd2kin Magazine"
              fill
              sizes="(min-width: 768px) 35vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-5 text-body text-paper">
            <p>
              Camila Peña Del Real is the Founder and Creative Director of 2econd2kin Magazine.
            </p>
            <p>
              With a creative background spanning dance, fashion, art, media, and editorial storytelling, Camila created 2econd2kin Magazine as a place where all of those worlds could exist together.
            </p>
            <p>
              Her background as a dancer shaped her understanding of movement, performance, clothing, music, and visual storytelling, while her lifelong relationship with fashion and art inspired her to explore the ways personal style can communicate identity.
            </p>
            <p>
              Inspired heavily by her mother, fashion, the creative communities around her, and her own experiences growing up between different artistic influences, Camila views fashion as something much deeper than clothing.
            </p>
            <p>
              Through 2econd2kin Magazine, she hopes to create a platform that champions emerging creatives, encourages collaboration, celebrates individuality, and gives young artists the freedom to create work that feels personal, experimental, and culturally alive.
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
