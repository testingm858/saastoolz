import Link from "next/link";
import { Lock, Eye, Heart } from "lucide-react";
import { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

interface Props {
  tool: Tool;
  visits?: number;
  likes?: number;
}

export default function ToolCard({ tool, visits, likes }: Props) {
  const className = cn(
    "group relative flex flex-col gap-2 p-4 rounded-xl border transition-all duration-200",
    "bg-white",
    tool.isPremium
      ? "border-violet-100 cursor-default"
      : "border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5"
  );

  const content = (
    <>
      {/* Premium badge */}
      {tool.isPremium && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
          <Lock className="w-3 h-3" /> PRO
        </span>
      )}
      {tool.isNew && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
          {tool.isUpdated && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" title="Recently updated" />}
          NEW
        </span>
      )}

      {/* Icon + name */}
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{tool.icon}</span>
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors leading-tight">
          {tool.name}
        </h3>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
        {tool.description}
      </p>

      {/* Credit badge for AI tools */}
      {tool.creditsPerUse && (
        <span className="text-xs text-violet-500 font-medium mt-auto">
          {tool.creditsPerUse} credits / use
        </span>
      )}

      {/* Engagement stats — visits below a small threshold are hidden rather
          than shown as a hollow "0" or "3 visits", which reads as fake
          engagement on a freshly-added or low-traffic tool. */}
      {((visits !== undefined && visits >= 10) || likes !== undefined) && (
        <div className={cn("flex items-center gap-3 text-xs text-gray-400", !tool.creditsPerUse && "mt-auto pt-0.5")}>
          {visits !== undefined && visits >= 10 && (
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {visits.toLocaleString()}</span>
          )}
          {likes !== undefined && (
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {likes.toLocaleString()}</span>
          )}
        </div>
      )}
    </>
  );

  // PRO tools are unlinked site-wide — the card still renders (badge and
  // all) wherever tools are listed, it just isn't a navigable link.
  if (tool.isPremium) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={`/tools/${tool.id}`} className={className}>
      {content}
    </Link>
  );
}
