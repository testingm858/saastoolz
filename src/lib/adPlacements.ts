// Canonical ad placement definitions — shared by the admin form (dropdowns),
// the API (validates page+position, derives the DB key), and every page that
// renders an <AdSlot>. Adding a new page location means adding an entry here
// plus a lookup call at the actual render point; nothing else needs to agree
// on naming since it's all derived from this one map.

export const AD_PAGES = [
  { value: "home", label: "Home Page" },
  { value: "tools", label: "Tools Page" },
  { value: "tool-action", label: "Tool Action Page" },
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
export const WIRED_PLACEMENTS: { key: string; description: string }[] = [
  { key: adSlotKey("home", "bottom"), description: "Home — bottom of Hero section" },
  { key: adSlotKey("home", "middle"), description: 'Home — after "Why SaaSToolz?" section' },
  { key: adSlotKey("tools", "top"), description: "Tools page — above the tool list" },
  { key: adSlotKey("tools", "middle"), description: "Tools page — in-feed, between tool groups" },
  { key: adSlotKey("tools", "bottom"), description: "Tools page — below the tool list" },
  { key: adSlotKey("tool-action", "middle"), description: "Tool page — before Related Tools" },
  { key: adSlotKey("tool-action", "bottom"), description: "Tool page — after the FAQ section" },
];
