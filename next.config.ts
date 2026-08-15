import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TEMPORARY — for manual shop-flow QA only, remove before real use.
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
  },
};

export default nextConfig;
