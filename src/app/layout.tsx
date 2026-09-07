import type { Metadata } from "next";
import { antonio, publicSans, jetbrainsMono } from "./fonts";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/nav/Footer";
import { CartUiProvider } from "@/components/cart/CartUiContext";
import { CartSlideOver } from "@/components/cart/CartSlideOver";
import { LaunchGate } from "@/components/gate/LaunchGate";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://2econd2kin.com"),
  title: {
    default: "2econd2kin Magazine",
    template: "%s — 2econd2kin Magazine",
  },
  description: "2econd2kin Magazine — clothing as a layer worn against the body.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${antonio.variable} ${publicSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink text-paper">
        <LaunchGate>
          <CartUiProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartSlideOver />
          </CartUiProvider>
        </LaunchGate>
      </body>
    </html>
  );
}
