import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { bts } from "@/content/bts";

export const metadata: Metadata = {
  title: "Behind the Scenes",
};

// Deliberately rougher than the lookbook: an uneven grid (every third
// entry runs wider) rather than a uniform gallery — reads as a feed, not
// a curated shoot. Video entries render as a placeholder rather than a
// self-hosted <video>: plan §5 is explicit that BTS clips must be
// adaptively streamed via Mux/Cloudinary, not raw MP4s, once real footage
// exists.
export default function BehindTheScenesPage() {
  // Hidden for this iteration of the site — not linked in the nav, and
  // the route itself 404s so a guessed URL doesn't leak the page either.
  notFound();

  return (
    <Section>
      <h1 className="type-display text-h1 text-hot">Behind the Scenes</h1>
      {bts.length === 0 ? (
        <p className="mt-8 type-meta text-meta text-paper/60">Coming soon</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {bts.map((entry, i) => {
            // At md:grid-cols-4, a wide (2-col) entry followed by two
            // normal entries exactly fills the first row (2+1+1), so i<3
            // covers everything above the fold on desktop regardless of
            // whether those first three entries are images or videos.
            const wide = i % 3 === 0;
            return (
              <figure key={entry.src} className={wide ? "col-span-2" : "col-span-1"}>
                {entry.type === "image" ? (
                  <Image
                    src={entry.src}
                    alt={entry.alt}
                    width={800}
                    height={800}
                    sizes={
                      wide ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"
                    }
                    priority={i < 3}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-paper/5 type-meta text-meta text-paper/60">
                    Video
                  </div>
                )}
                <figcaption className="mt-2">
                  <time dateTime={entry.date} className="type-meta text-meta text-paper/60">
                    {entry.date}
                  </time>
                  {entry.caption && <p className="mt-1 text-body text-paper">{entry.caption}</p>}
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </Section>
  );
}
