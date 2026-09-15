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
// When no code is configured (nothing pasted in /admin/ads yet, or ads are
// gated off in this environment — see lib/ads.ts), shows a dashed, clearly-
// labeled placeholder instead of reserving invisible space — lets the site
// owner see every slot's position/size while designing, without pretending
// to be an actual ad (labeled, honest, not deceptive — that's the line
// AdSense policy actually cares about, not whether a box is visible).
export default function AdSlot({ code, position }: { code: string | null; position: AdPosition }) {
  const isVertical = orientationFor(position) === "vertical";
  const maxWidth = isVertical ? "max-w-[300px]" : "max-w-3xl";
  const height = isVertical ? 600 : 100;

  if (!code) {
    return (
      <div className={cn("w-full mx-auto my-8", maxWidth)}>
        <div
          className="w-full flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60"
          style={{ height }}
        >
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-[0.2em] select-none">
            Advertisement
          </span>
        </div>
      </div>
    );
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
