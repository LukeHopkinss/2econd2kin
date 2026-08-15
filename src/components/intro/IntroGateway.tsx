"use client";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { IntroOverlay } from "./IntroOverlay";
import { useIntroGate } from "./useIntroGate";

// Only rendered from the "/" route (see app/page.tsx) — that alone is
// what makes deep links skip the intro, no pathname check needed here.
// useIntroGate() latches to true internally once it first resolves that
// way, so it's safe to gate directly on it here: it won't flip back to
// false mid-fade when the overlay's own exit() writes sessionStorage.
export function IntroGateway() {
  const shouldShow = useIntroGate();
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {shouldShow && visible && <IntroOverlay onComplete={() => setVisible(false)} />}
    </AnimatePresence>
  );
}
