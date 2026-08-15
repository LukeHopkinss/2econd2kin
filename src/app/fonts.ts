import { Antonio, Public_Sans, JetBrains_Mono } from "next/font/google";

// Antonio's variable weight axis is 100-700 — 700 IS its extra bold.
// There is no 800/900; requesting it clamps to 700 or triggers a
// browser-synthesized fake bold. Always request "700" explicitly.
export const antonio = Antonio({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-display",
  display: "swap",
});

export const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
