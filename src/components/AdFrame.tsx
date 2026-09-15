"use client";

import { useState } from "react";

// Ad network snippets (Adsterra's invoke.js in particular) commonly call
// document.write() internally. That works fine when a script is parsed
// inline in the original document, but silently no-ops (or gets blocked
// outright — Chrome's "Intervention: document.write" warning) when the
// script is inserted dynamically after the page has already loaded, which
// is exactly what happens if you inject ad HTML directly into the live DOM.
// Rendering inside a sandboxed iframe via srcDoc sidesteps this entirely —
// the iframe gets its own fresh document, so document.write() works exactly
// as the ad network expects, for every network (Adsterra, AdSense, etc).
export default function AdFrame({ html, height }: { html: string; height: number }) {
  const [loaded, setLoaded] = useState(false);
  const srcDoc = `<!DOCTYPE html><html><head><style>html,body{margin:0;padding:0;display:flex;align-items:center;justify-content:center;overflow:hidden;}</style></head><body>${html}</body></html>`;

  return (
    <iframe
      srcDoc={srcDoc}
      title="Advertisement"
      style={{ width: "100%", height, border: "none", overflow: "hidden" }}
      scrolling="no"
      onLoad={() => setLoaded(true)}
      // A quick fade once the creative has actually loaded reads as
      // intentional design rather than a layout pop-in — small touch, no
      // effect on the ad content itself.
      className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}
