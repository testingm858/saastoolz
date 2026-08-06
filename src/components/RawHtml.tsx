"use client";

import { useEffect, useRef } from "react";

// Ad network embed codes are always script-based, and browsers never execute
// <script> tags inserted via innerHTML — so we re-create each one as a real
// script element (this is the standard technique for injecting third-party
// embeds client-side; React's dangerouslySetInnerHTML alone would silently
// no-op every ad network's snippet).
export default function RawHtml({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = html;

    const scripts = Array.from(container.querySelectorAll("script"));
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) {
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.text = oldScript.text;
      oldScript.replaceWith(newScript);
    }

    return () => {
      container.innerHTML = "";
    };
  }, [html]);

  return <div ref={ref} />;
}
