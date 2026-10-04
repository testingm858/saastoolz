// Single source of truth for which pages are allowed to render ads. AdSense
// policy requires ads to appear only alongside genuine publisher content —
// never on index/listing pages, auth, account, legal, or admin screens.
// Every page that renders an <AdSlot> should gate it through this function
// rather than deciding independently.

// Tools excluded from ads even though they're otherwise eligible tool pages
// (e.g. a tool under extra scrutiny for other policy reasons).
const AD_DENIED_TOOL_SLUGS = new Set(["pdf-unlock"]);

export function canShowAds(pathname: string): boolean {
  // The homepage carries two manually placed units (see src/app/page.tsx).
  // Index/listing pages are the highest-risk place for ads under AdSense
  // policy, so these slots only render once ad code is pasted in /admin/ads;
  // remove this line to take every ad off the homepage again.
  if (pathname === "/") return true;

  const toolMatch = pathname.match(/^\/tools\/([^/]+)\/?$/);
  if (toolMatch) return !AD_DENIED_TOOL_SLUGS.has(toolMatch[1]);

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) return true;

  return false;
}
