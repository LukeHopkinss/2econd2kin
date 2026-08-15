import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { LayerWipe } from "@/components/lookbook/LayerWipe";
import { lookbook } from "@/content/lookbook";

export const metadata: Metadata = {
  title: "Lookbook",
};

export default function LookbookPage() {
  return (
    <Section>
      <h1 className="type-display text-h1 text-hot">Lookbook</h1>
      {lookbook.length === 0 ? (
        <p className="mt-8 type-meta text-meta text-paper/60">Coming soon</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {lookbook.map((shot, i) => (
            <figure key={shot.src}>
              <LayerWipe
                src={shot.src}
                alt={shot.alt}
                under={shot.under}
                underAlt={shot.underAlt}
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={i < 2}
              />
              {shot.caption && (
                <figcaption className="mt-3 type-meta text-meta text-paper/60">
                  {shot.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </Section>
  );
}
