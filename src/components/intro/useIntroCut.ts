"use client";

import { useSyncExternalStore } from "react";

export type Cut = {
  mp4: string;
  webm?: string;
  poster?: string;
};

const PORTRAIT: Cut = {
  mp4: "/video/intro-portrait.mp4",
};

const LANDSCAPE: Cut = {
  mp4: "/video/intro-landscape.mp4",
};

// portrait OR narrow viewport -> mobile cut. Chosen on orientation +
// width, not user-agent sniffing — a tablet in portrait should get the
// portrait cut, which UA sniffing gets wrong.
const QUERY = "(max-width: 767px), (orientation: portrait)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): Cut {
  return window.matchMedia(QUERY).matches ? PORTRAIT : LANDSCAPE;
}

// null on the server and on first hydration pass — render the black
// overlay with no flash while this resolves on the client.
function getServerSnapshot(): Cut | null {
  return null;
}

export function useIntroCut(): Cut | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
