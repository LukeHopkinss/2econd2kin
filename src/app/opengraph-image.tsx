import { ImageResponse } from "next/og";

export const alt = "2econd2kin — clothing as a layer worn against the body.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "2ECOND2KIN";
const TAGLINE = "Clothing as a layer worn against the body.";

// next/og's ImageResponse (satori) doesn't synthesize font weights — the
// bundled default font only has a regular weight, so `fontWeight: 700`
// silently renders as regular. Google Fonts' CSS2 API returns a `.ttf`
// (not the usual `.woff2`) when the request is subsetted with `&text=`,
// which is what satori needs — this is the same technique Vercel's own
// OG image examples use. No local font file to bundle/maintain.
async function loadBoldFont(text: string): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@700&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\) format\('truetype'\)/);
  if (!match) throw new Error("Could not resolve Google Fonts truetype URL");
  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export default async function OpengraphImage() {
  const fontData = await loadBoldFont(TITLE + TAGLINE);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#000000",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#ff00b0",
            lineHeight: 0.9,
            textTransform: "uppercase",
          }}
        >
          {TITLE}
        </div>
        <div style={{ fontFamily: "Inter", fontSize: 32, color: "#ffffff", marginTop: 24 }}>
          {TAGLINE}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: fontData, weight: 700, style: "normal" }],
    },
  );
}
