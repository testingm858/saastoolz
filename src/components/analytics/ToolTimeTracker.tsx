"use client";

import { useEffect, useRef } from "react";

// Mounted once per tool page. Measures how long the visitor actually had the
// tool open and reports it (once) via sendBeacon — on tab-hide, on unload, or
// on unmount (a client-side route change away from the page), whichever
// comes first. sendBeacon (not fetch) because this fires during teardown,
// when a normal fetch could be cancelled before it reaches the network.
export default function ToolTimeTracker({ toolId }: { toolId: string }) {
  const sentRef = useRef(false);

  useEffect(() => {
    sentRef.current = false;
    const startedAt = performance.now();

    const send = () => {
      if (sentRef.current) return;
      sentRef.current = true;
      const durationMs = performance.now() - startedAt;
      const payload = JSON.stringify({ toolId, durationMs });
      try {
        navigator.sendBeacon("/api/analytics/tool-visit", new Blob([payload], { type: "application/json" }));
      } catch {
        /* non-blocking */
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") send();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", send);

    return () => {
      send();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", send);
    };
  }, [toolId]);

  return null;
}
