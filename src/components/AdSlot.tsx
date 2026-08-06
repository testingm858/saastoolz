import RawHtml from "./RawHtml";

// A single horizontal ad placement per tool page. The actual embed code is
// admin-managed (see /admin/ads, key "tool-page") rather than hardcoded, so
// switching ad networks or updating a snippet doesn't need a redeploy.
export default function AdSlot({ code }: { code: string | null }) {
  if (!code) {
    return (
      <div className="w-full max-w-3xl mx-auto my-6 h-[90px] rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
        <span className="text-xs text-gray-300 uppercase tracking-wide">Advertisement</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-6 overflow-hidden">
      <RawHtml html={code} />
    </div>
  );
}
