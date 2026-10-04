// Single source of truth for which pages are allowed to render ads. AdSense
// policy favors ads alongside genuine publisher content (tool pages and blog
// posts) and is strictest about index/listing pages, auth, account, legal and
// admin screens. Every page that renders an <AdSlot> should gate it through
// this function rather than deciding independently.

// Tools excluded from ads even though they're otherwise eligible tool pages
// (e.g. a tool under extra scrutiny for other policy reasons).
const AD_DENIED_TOOL_SLUGS = new Set(["pdf-unlock"]);

// Whether an ad slot with no ad code configured still draws its labeled
// "Advertisement" placeholder card on the live site. Turn this off to show
// visitors nothing at all until real ad code is pasted in /admin/ads. In
// development and preview the placeholder always shows.
export const SHOW_EMPTY_AD_PLACEHOLDERS = true;

export function adSlotVisible(code: string | null): boolean {
  return Boolean(code) || SHOW_EMPTY_AD_PLACEHOLDERS || process.env.NODE_ENV !== "production";
}

export function canShowAds(pathname: string): boolean {
  // The homepage and the /tools index carry manually placed units (see
  // src/app/page.tsx and src/app/tools/ToolsListClient.tsx). Listing pages are
  // the highest-risk place for ads under AdSense policy; remove these two
  // lines to take every ad off them again.
  if (pathname === "/" || pathname === "/tools") return true;

  const toolMatch = pathname.match(/^\/tools\/([^/]+)\/?$/);
  if (toolMatch) return !AD_DENIED_TOOL_SLUGS.has(toolMatch[1]);

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) return true;

  return false;
}
