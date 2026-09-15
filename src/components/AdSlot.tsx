import AdFrame from "./AdFrame";
import { orientationFor, type AdPosition } from "@/lib/adPlacements";
import { cn } from "@/lib/utils";

// A single ad placement. The actual embed code is admin-managed (see
// /admin/ads) rather than hardcoded, so switching ad networks or updating a
// snippet doesn't need a redeploy. Sizing follows orientation: left/right
// placements are narrow verticals (skyscraper-style), everything else is a
// wide horizontal banner.
//
// Wrapped in the same card treatment used everywhere else on the site
// (rounded-2xl, hairline border, soft shadow — see ToolCard/About's feature
// cards) plus a small uppercase "Advertisement" label, so a real ad reads as
// an intentional, clearly-labeled part of the page rather than a stray
// embed. The container itself stays fluid (w-full up to the slot's max
// width) so a responsive AdSense unit sizes to the full available width at
// every breakpoint instead of being squeezed into a fixed box — the
// config that actually matters for fill rate/revenue with responsive units.
//
// Renders nothing when no code is configured — an empty "Advertisement"
// placeholder box that never fills is itself a poor ad-policy signal
// (reserved space with no content), so we just don't reserve the space.
export default function AdSlot({ code, position }: { code: string | null; position: AdPosition }) {
  const isVertical = orientationFor(position) === "vertical";
  const maxWidth = isVertical ? "max-w-[300px]" : "max-w-3xl";
  const height = isVertical ? 600 : 100;

  if (!code) {
    return null;
  }

  return (
    <div className={cn("w-full mx-auto my-8 flex flex-col items-center gap-2", maxWidth)}>
      <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-[0.2em] select-none">
        Advertisement
      </span>
      <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <AdFrame html={code} height={height} />
      </div>
    </div>
  );
}
