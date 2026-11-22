import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Website Studio — Beautiful wedding websites, sold on Etsy",
  description:
    "Wedding Website Studio lets couples publish a beautiful wedding website with RSVP, countdown, gallery and QR code — from a template bought on Etsy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
