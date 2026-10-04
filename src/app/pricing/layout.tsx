import type { Metadata } from "next";
import { FREE_TOOLS } from "@/lib/tools";

const DESCRIPTION = `Simple, transparent pricing — ${FREE_TOOLS.length} online tools free forever, plus an optional Pro plan for AI-powered tools.`;

export const metadata: Metadata = {
  title: "Pricing — Free Tools and Pro Plan",
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | SaaSToolz",
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
