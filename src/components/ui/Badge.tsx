import type { ReactNode } from "react";

type Tone = "acid" | "cyan" | "hot" | "violet";

const toneClasses: Record<Tone, string> = {
  acid: "bg-acid text-ink",
  cyan: "bg-cyan text-ink",
  hot: "bg-hot text-ink",
  violet: "bg-violet text-ink",
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
