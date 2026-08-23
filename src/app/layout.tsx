import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const SITE_URL = "https://use-show-window-size.kkweb.io";
const TITLE = "use-show-window-size";
const DESCRIPTION = "React hook that overlays the current viewport size for development.";

/* 見出しの書体。9件が同じ字面だと、並んだときに見分けが付かない */
const display = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: "/icon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: TITLE,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = { themeColor: "#0f172a" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={display.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
