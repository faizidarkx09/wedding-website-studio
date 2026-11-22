import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Display serifs per theme (see globals.css .font-* classes). Every
// family falls back to a system serif/sans stack, so the site stays
// readable even if a font file cannot be fetched at build time.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-ebgaramond",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wedding Website Studio — Beautiful wedding websites, sold on Etsy",
  description:
    "Wedding Website Studio lets couples publish a beautiful wedding website with RSVP, countdown, gallery and QR code — from a template bought on Etsy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${ebGaramond.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
