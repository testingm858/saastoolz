// Lightweight bot/crawler + prefetch detection for request-driven counters
// (e.g. the public "N visits" stat on a tool page) that would otherwise
// count every crawl — including AdSense's own Mediapartners-Google — as a
// real visit. Not meant to be exhaustive spam/bot protection, just enough
// to keep an engagement counter honest.
const BOT_USER_AGENT_RE =
  /bot|crawl|spider|slurp|mediapartners|adsbot|facebookexternalhit|preview|headless|lighthouse|pingdom|uptimerobot|ahrefs|semrush|bingpreview/i;

export function isBotOrPrefetchRequest(h: Headers): boolean {
  const ua = h.get("user-agent") ?? "";
  if (!ua || BOT_USER_AGENT_RE.test(ua)) return true;

  // Next.js client-side route prefetching, and the standard prefetch hint
  // some browsers/proxies send — neither represents a person viewing the
  // page.
  if (h.get("next-router-prefetch") === "1") return true;
  if (h.get("purpose") === "prefetch" || h.get("sec-purpose")?.includes("prefetch")) return true;

  return false;
}
