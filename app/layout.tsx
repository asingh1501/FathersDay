import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteContent } from "@/src/data/site-content";

export const metadata: Metadata = {
  title: `${siteContent.pageTitle} — Our Favorite Memories`,
  description: siteContent.subtitle,
  robots: siteContent.noIndex ? { index: false, follow: false, nocache: true } : undefined,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#18372f" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Browser extensions and injected accessibility tools can add styles to the
  // root element before React starts. That harmless mutation should not surface
  // as a hydration error for the entire memory book.
  return <html lang="en" suppressHydrationWarning><body>{children}</body></html>;
}
