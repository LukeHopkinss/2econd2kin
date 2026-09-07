"use client";

import { useEffect, useState, type ReactNode } from "react";

// Reveal happens at 8pm in the visitor's own local time/timezone, computed
// entirely client-side (never on the server, whose clock/timezone may
// differ from the visitor's) — this also keeps the server-rendered HTML
// and the client's first paint identical (both start "locked"), so there's
// no hydration mismatch; the real check only runs after mount.
const REVEAL_HOUR = 20;

// ?preview=1 bypasses the gate entirely — useful for checking the real
// site before the reveal without waiting or changing the system clock.
// ?revealInSec=60 instead overrides the target to "60 seconds from
// whenever the page loaded" — lets the countdown/reveal transition
// itself be tested without waiting for 8pm. Both are read once per
// mount (not per tick) so the deadline doesn't drift.
function getRevealTarget() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("preview") === "1") return Date.now();
  const override = params.get("revealInSec");
  if (override !== null) {
    const seconds = Number(override);
    if (Number.isFinite(seconds)) return Date.now() + seconds * 1000;
  }
  const target = new Date();
  target.setHours(REVEAL_HOUR, 0, 0, 0);
  return target.getTime();
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function LaunchGate({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const revealAt = getRevealTarget();
    function tick() {
      const remaining = revealAt - Date.now();
      if (remaining <= 0) {
        setRevealed(true);
      } else {
        setMsLeft(remaining);
      }
    }
    // Deferred rather than called synchronously here so the state update
    // happens in a callback, not directly in the effect body.
    const immediate = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(immediate);
      clearInterval(id);
    };
  }, []);

  if (revealed) return <>{children}</>;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="type-display text-h1 text-hot">2ECOND2KIN MAGAZINE</p>
      <p className="mt-6 type-meta text-meta text-paper/60">
        {msLeft === null ? "Unlock your second skin at 8:00 PM." : `Unlocking in ${formatCountdown(msLeft)}`}
      </p>
    </div>
  );
}
