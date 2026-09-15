// Canonical ad placement definitions — shared by the admin form (dropdowns),
// the API (validates page+position, derives the DB key), and every page that
// renders an <AdSlot>. Adding a new page location means adding an entry here
// plus a lookup call at the actual render point; nothing else needs to agree
// on naming since it's all derived from this one map.

export const AD_PAGES = [
  { value: "home", label: "Home Page" },
  { value: "tools", label: "Tools Page" },
  { value: "tool-action", label: "Tool Action Page" },
  { value: "blog-post", label: "Blog Post" },
] as const;

export const AD_POSITIONS = [
  { value: "top", label: "Top", orientation: "horizontal" },
  { value: "middle", label: "Middle", orientation: "horizontal" },
  { value: "bottom", label: "Bottom", orientation: "horizontal" },
  { value: "left", label: "Left", orientation: "vertical" },
  { value: "right", label: "Right", orientation: "vertical" },
] as const;

export type AdPage = (typeof AD_PAGES)[number]["value"];
export type AdPosition = (typeof AD_POSITIONS)[number]["value"];

export function isAdPage(v: unknown): v is AdPage {
  return typeof v === "string" && AD_PAGES.some((p) => p.value === v);
}

export function isAdPosition(v: unknown): v is AdPosition {
  return typeof v === "string" && AD_POSITIONS.some((p) => p.value === v);
}

export function adSlotKey(page: AdPage, position: AdPosition): string {
  return `${page}-${position}`;
}

export function orientationFor(position: AdPosition): "horizontal" | "vertical" {
  return AD_POSITIONS.find((p) => p.value === position)?.orientation ?? "horizontal";
}

export function pageLabel(page: string): string {
  return AD_PAGES.find((p) => p.value === page)?.label ?? page;
}

export function positionLabel(position: string): string {
  return AD_POSITIONS.find((p) => p.value === position)?.label ?? position;
}

// Every placement actually wired into a page right now, for the admin
// list's "Live placement" vs "Not wired yet" badge.
//
// AdSense policy allows ads only on pages with individual publisher content
// — tool pages and blog posts — never on index/listing pages (home, the
// /tools index, category pages) or account/legal/admin screens. "home" and
// "tools" placements exist as AD_PAGES options for backward compatibility
// with any slots an admin already configured, but nothing renders them
// anymore; don't wire them back in.
export const WIRED_PLACEMENTS: { key: string; description: string }[] = [
  { key: adSlotKey("tool-action", "top"), description: "Tool page — after \"How to use\" steps, before the guide" },
  { key: adSlotKey("tool-action", "middle"), description: "Tool page — before Related Tools" },
  { key: adSlotKey("tool-action", "bottom"), description: "Tool page — after the FAQ section" },
  { key: adSlotKey("blog-post", "middle"), description: "Blog post — after the cover image, before the article" },
  { key: adSlotKey("blog-post", "bottom"), description: "Blog post — after the article content" },
];
