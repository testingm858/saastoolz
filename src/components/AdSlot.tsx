import AdFrame from "./AdFrame";
import { orientationFor, type AdPosition } from "@/lib/adPlacements";
import { cn } from "@/lib/utils";

// A single ad placement. The actual embed code is admin-managed (see
// /admin/ads) rather than hardcoded, so switching ad networks or updating a
// snippet doesn't need a redeploy. Sizing follows orientation: left/right
// placements are narrow verticals (skyscraper-style), everything else is a
// wide horizontal banner.
export default function AdSlot({ code, position }: { code: string | null; position: AdPosition }) {
  const isVertical = orientationFor(position) === "vertical";
  const containerClass = isVertical ? "w-full max-w-[300px] mx-auto my-6" : "w-full max-w-3xl mx-auto my-6";
  const height = isVertical ? 600 : 100;

  if (!code) {
    return (
      <div
        className={cn(containerClass, "rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center")}
        style={{ height }}
      >
        <span className="text-xs text-gray-300 uppercase tracking-wide">Advertisement</span>
      </div>
    );
  }

  return (
    <div className={cn(containerClass, "overflow-hidden")}>
      <AdFrame html={code} height={height} />
    </div>
  );
}
