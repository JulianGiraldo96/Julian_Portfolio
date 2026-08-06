import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { RouteVeil } from "@/components/v2/RouteVeil";
import { GooDefs, ThemeScript } from "@/components/v2/Theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Julian Giraldo | Product Designer",
  description: "Product Designer based in Berlin.",
  openGraph: {
    title: "Julian Giraldo | Product Designer",
    description: "Product Designer based in Berlin.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* The theme bootstrap writes data-v2-theme onto <html> before React
       hydrates, which is the whole point: it is what stops a dark page from
       flashing white. React then finds an attribute the server never rendered
       and reports a hydration mismatch, and this is the documented way to tell
       it that this element is expected to differ. It covers <html>'s own
       attributes only, nothing inside it. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
    >
      <body className="bg-background text-foreground">
        {/* the theme is written onto <html> before this subtree paints, so a
            dark reload never flashes white */}
        <ThemeScript />
        <GooDefs />
        <SmoothScroll>
          {children}
          <RouteVeil />
        </SmoothScroll>
      </body>
    </html>
  );
}
