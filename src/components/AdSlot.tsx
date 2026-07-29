"use client";

import { useEffect } from "react";

// A single horizontal ad placement per tool page (iLovePDF/iLoveIMG-style).
// Renders a real AdSense unit once NEXT_PUBLIC_ADSENSE_CLIENT_ID/SLOT_ID are
// configured (see AdSenseLoader in layout.tsx for the matching script tag);
// otherwise falls back to a neutral placeholder so layout/spacing stays
// identical in every environment, configured or not.
const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const SLOT_ID = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

export default function AdSlot() {
  const configured = !!CLIENT_ID && !!SLOT_ID;

  useEffect(() => {
    if (!configured) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // AdSense script blocked (ad blocker, offline, etc) — fail silently
    }
  }, [configured]);

  if (!configured) {
    return (
      <div className="w-full max-w-3xl mx-auto my-6 h-[90px] rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
        <span className="text-xs text-gray-300 uppercase tracking-wide">Advertisement</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-6 overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_ID}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}
