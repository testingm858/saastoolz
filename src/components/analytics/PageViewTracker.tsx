"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Mounted once in the root layout. Fires a first-party page-view beacon on
// every route change (App Router doesn't do full page loads between routes,
// so a server-side counter alone would miss client-side navigations).
export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, referrer: document.referrer || undefined }),
      keepalive: true,
    }).catch(() => {
      /* non-blocking */
    });
  }, [pathname, searchParams]);

  return null;
}
