import AdFrame from "./AdFrame";
import { orientationFor, type AdPosition } from "@/lib/adPlacements";
import { cn } from "@/lib/utils";
import { adSlotVisible } from "@/lib/ads/policy";

// A single ad placement. The actual embed code is admin-managed (see
// /admin/ads) rather than hardcoded, so switching ad networks or updating a
// snippet doesn't need a redeploy. Sizing follows orientation: left/right
// placements are narrow verticals (skyscraper-style), everything else is a
// wide horizontal banner.
//
// Wrapped in the same card treatment used everywhere else on the site
// (rounded-2xl, hairline border, soft shadow) plus a small uppercase
// "Advertisement" label, so a real ad reads as an intentional, clearly-labeled
// part of the page rather than a stray embed. The container stays fluid
// (w-full up to the slot's max width) so a responsive AdSense unit sizes to the
// full available width at every breakpoint.
//
// Two layouts:
//  - "inline"   (default) sits in the normal flow with vertical margins.
//  - "floating" is a raised card meant to straddle the boundary between two
//               page sections: it pulls itself up over the section above
//               (negative top margin) and floats over both backgrounds. The
//               overlap lives on this component's own root, so when there is
//               nothing to show the page layout is unaffected.
//
// When no code is configured, a clearly labeled placeholder card shows so slot
// positions and sizes are visible. Whether that placeholder also appears on the
// live site is controlled by SHOW_EMPTY_AD_PLACEHOLDERS in lib/ads/policy.ts.
export default function AdSlot({
  code,
  position,
  variant = "inline",
}: {
  code: string | null;
  position: AdPosition;
  variant?: "inline" | "floating";
}) {
  const isVertical = orientationFor(position) === "vertical";
  const maxWidth = isVertical ? "max-w-[300px]" : "max-w-3xl";
  const height = isVertical ? 600 : 100;
  const floating = variant === "floating";

  // Floating: no outer vertical margin of its own, lifted over the section above.
  const rootClass = floating
    ? "relative z-10 w-full mx-auto -mt-10 mb-2 px-4"
    : "w-full mx-auto my-8";
  const cardShadow = floating ? "shadow-xl shadow-violet-900/5" : "shadow-sm";

  if (!code) {
    if (!adSlotVisible(code)) return null;
    return (
      <div className={rootClass}>
        <div className={cn("mx-auto", maxWidth)}>
          <div className={cn("rounded-2xl border border-gray-200 bg-white overflow-hidden", cardShadow)}>
            <div className="flex items-center justify-between px-4 pt-2.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] select-none">
                Advertisement
              </span>
              <span className="text-[10px] text-gray-300 select-none">Ad space</span>
            </div>
            <div
              className="flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-violet-50/40 m-3 rounded-xl border border-dashed border-gray-200"
              style={{ height: height - 24 }}
            >
              <span className="text-xs font-medium text-gray-300 tracking-wide select-none">
                {isVertical ? "300 × 600" : "728 × 90"} · Responsive ad unit
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(rootClass, !floating && "flex flex-col items-center gap-2")}>
      <div className={cn("mx-auto flex flex-col items-center gap-2", maxWidth)}>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] select-none">
          Advertisement
        </span>
        <div className={cn("w-full overflow-hidden rounded-2xl border border-gray-100 bg-white", cardShadow)}>
          <AdFrame html={code} height={height} />
        </div>
      </div>
    </div>
  );
}
