import type { ReactNode } from "react";

type Tone = "acid" | "cyan" | "hot" | "violet";

// acid/cyan are too light for white (text-ink) to read on — black
// (text-paper) is legible against all four, so it's used everywhere
// rather than only where it's strictly required.
const toneClasses: Record<Tone, string> = {
  acid: "bg-acid text-paper",
  cyan: "bg-cyan text-paper",
  hot: "bg-hot text-paper",
  violet: "bg-violet text-paper",
};

export function Badge({ children, tone = "acid" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-block px-2 py-1 type-meta text-meta ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
