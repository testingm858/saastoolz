import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { FREE_TOOLS } from "@/lib/tools";
import { BASE_URL } from "@/lib/site";

const TOTAL_TOOLS = FREE_TOOLS.length;

// Organization + WebSite (with a SearchAction so Google can offer a sitelinks
// search box) — the one piece of structured data relevant on every page.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "SaaSToolz",
      url: BASE_URL,
      logo: `${BASE_URL}/logo.jpeg`,
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      name: "SaaSToolz",
      url: BASE_URL,
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${BASE_URL}/tools?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: `SaaSToolz - ${TOTAL_TOOLS} Free Online Tools`,
    template: "%s | SaaSToolz",
  },
  description: `Free PDF tools, image tools, audio tools, developer tools and calculators. ${TOTAL_TOOLS} tools in one platform. No signup required.`,
  keywords: ["pdf tools", "image tools", "audio tools", "developer tools", "online tools", "free tools"],
  openGraph: {
    type: "website",
    siteName: "SaaSToolz",
    title: `SaaSToolz - ${TOTAL_TOOLS} Free Online Tools`,
    description: "Free PDF, image, audio and developer tools. No signup required.",
  },
  twitter: { card: "summary_large_image" },
  metadataBase: new URL(BASE_URL),
  verification: { google: "7a9nGavijUksW8w5dciWXPvBwRbEh6tHMm5iypLwBkQ" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
