import type { Metadata } from "next";
import { Allura, Beau_Rivage, Cinzel, Cormorant_Garamond, DM_Mono, EB_Garamond, Great_Vibes, Imperial_Script, Inter, Lora, Manrope, Ovo, Playfair_Display, Rufina } from "next/font/google";
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
// ÉTERNEL: Manrope body + Allura script accents.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
  display: "swap",
});
// AN ETERNAL MOMENT: DM Mono (mono labels — Cormorant Garamond
// display + Manrope body are already imported above).
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});
// THE SACRED GARDEN: Beau Rivage (couple names) + Imperial Script
// (section titles) + Cinzel ("Tap to open") + Ovo (dates/times).
const beauRivage = Beau_Rivage({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-beaurivage",
  display: "swap",
});
const imperialScript = Imperial_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-imperial",
  display: "swap",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-cinzel",
  display: "swap",
});
const ovo = Ovo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ovo",
  display: "swap",
});
// DOLCE VITA: Rufina (body — the standalone's body face; Imperial
// Script + Ovo are already imported above for Sacred Garden).
const rufina = Rufina({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-rufina",
  display: "swap",
});
// ROYAL BURGUNDY: Great Vibes (cover script names) + Lora (editorial
// body italic). Allura (alternate script) + Cormorant Garamond
// (display serif) + Cinzel (display caps) are already imported above.
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wedding Website Studio — Beautiful wedding websites, sold on Etsy",
  description:
    "Wedding Website Studio lets couples publish a beautiful wedding website with RSVP, countdown, gallery and QR code — from a template bought on Etsy.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${ebGaramond.variable} ${inter.variable} ${manrope.variable} ${allura.variable} ${beauRivage.variable} ${imperialScript.variable} ${cinzel.variable} ${ovo.variable} ${rufina.variable} ${greatVibes.variable} ${lora.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
