"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { canShowAds } from "@/lib/ads/policy";

// The AdSense loader script itself — not just our own AdSlot/AdFrame units —
// is what can trigger Google Auto Ads (which inject ads from the mere
// presence of a valid client ID, with no <ins> tag or push() call needed).
// Loading it unconditionally in the root layout meant Auto Ads could appear
// on every page in every environment, completely bypassing the page
// allowlist and the "never in dev" rule enforced elsewhere for our own ad
// slots. Mounting it only where canShowAds() and NODE_ENV agree closes that
// gap at the source.
export default function AdSenseLoader() {
  const pathname = usePathname();
  if (process.env.NODE_ENV !== "production") return null;
  if (!canShowAds(pathname)) return null;

  return (
    <Script
      async
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7420276461237909"
      crossOrigin="anonymous"
    />
  );
}
