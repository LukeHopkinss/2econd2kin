import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TEMPORARY — for manual shop-flow QA only, remove before real use.
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
  },
  // TEMPORARY — lets the dev server be reached from a phone on the LAN for
  // mobile QA (e.g. checking which intro video cut plays). Dev-only, has no
  // effect on `next build`/`next start`; remove if no longer needed.
  allowedDevOrigins: ["192.168.1.177"],
};

export default nextConfig;
