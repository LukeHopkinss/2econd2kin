// Placeholder for sections that aren't ready to show real content yet
// (shop, cart) — scattered question marks rather than a bare "coming
// soon" string, so it reads as an intentional cover rather than an
// unfinished page.
const MARKS = [
  { top: "10%", left: "14%", size: "2.5rem", rotate: -14, color: "text-hot" },
  { top: "18%", left: "78%", size: "4rem", rotate: 10, color: "text-cyan" },
  { top: "42%", left: "45%", size: "2rem", rotate: 18, color: "text-paper/30" },
  { top: "58%", left: "10%", size: "3.5rem", rotate: 12, color: "text-acid" },
  { top: "68%", left: "68%", size: "5rem", rotate: -8, color: "text-violet" },
  { top: "82%", left: "30%", size: "2.5rem", rotate: -20, color: "text-hot" },
  { top: "6%", left: "48%", size: "1.75rem", rotate: 8, color: "text-cyan" },
] as const;

export function QuestionMarkCover({
  label = "Coming soon",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex min-h-[40vh] w-full items-center justify-center overflow-hidden ${className}`}
    >
      {MARKS.map((mark, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`pointer-events-none absolute select-none type-display ${mark.color}`}
          style={{
            top: mark.top,
            left: mark.left,
            fontSize: mark.size,
            transform: `rotate(${mark.rotate}deg)`,
          }}
        >
          ?
        </span>
      ))}
      <p className="relative type-meta text-meta text-paper/60">{label}</p>
    </div>
  );
}
