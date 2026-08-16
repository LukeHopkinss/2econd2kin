"use client";

import { useSyncExternalStore } from "react";

const SESSION_KEY = "intro-seen";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

// Once the first real (post-hydration) check resolves to "show the
// intro", latch it — every later call returns true unconditionally,
// regardless of what sessionStorage/matchMedia say by then. Two reasons:
// 1) the overlay's own exit() writes sessionStorage partway through its
//    ~1.2s fade-out, and without a latch that write could flip this
//    store's value mid-fade, cutting the overlay instantly instead of
//    letting the animation finish; 2) useSyncExternalStore requires a
//    snapshot that isn't just true/false at whim on every re-render.
// Module-level, not React state — this is the store's own internal
// state, which is exactly what external stores are for.
let latchedShow = false;

// prefers-reduced-motion bypasses the intro entirely — an accessibility
// requirement, not a nicety. Session (not local) storage: a return visit
// next week should see the intro again, but shop -> about -> home in one
// session shouldn't replay it.
function getSnapshot(): boolean {
  if (latchedShow) return true;
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  if (reducedMotion) return false;
  const shouldShow = window.sessionStorage.getItem(SESSION_KEY) !== "1";
  if (shouldShow) latchedShow = true;
  return shouldShow;
}

// True on the server and on the first client render (pre-hydration): we
// can't know the real answer without sessionStorage/matchMedia, and the
// landing page must never flash unguarded before the overlay covers it.
// useSyncExternalStore reconciles this against the real getSnapshot()
// value immediately after mount, so a returning visitor sees this for at
// most one paint before the overlay is removed — never a video replay.
function getServerSnapshot(): boolean {
  return true;
}

export function useIntroGate(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function markIntroSeen() {
  window.sessionStorage.setItem(SESSION_KEY, "1");
}

// Call once the overlay has fully finished exiting (IntroGateway's
// onComplete) — not sooner, or the mid-fade getSnapshot() calls would
// stop returning the latched true and cut the animation short. Without
// this reset, latchedShow would stay true forever, so navigating away
// from "/" and back (a client-side remount, not a full page reload)
// would replay the intro even though sessionStorage already says it's
// been seen.
export function resetIntroLatch() {
  latchedShow = false;
}
