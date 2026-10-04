"use client";

import { Fragment, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { FREE_TOOLS, CATEGORY_META, type ToolCategory } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import AdSlot from "@/components/AdSlot";
import { adSlotVisible } from "@/lib/ads/policy";
import { cn } from "@/lib/utils";

// PRO tools are hidden site-wide — this page only ever lists FREE_TOOLS, and
// the "ai-*" (Pro) categories are dropped from the category filter below.
// /category/ai-* itself 404s now too, so there's nothing left to link to.
const VISIBLE_CATEGORIES = Object.entries(CATEGORY_META).filter(([key]) => !key.startsWith("ai-"));

export type ToolStatsMap = Record<string, { views: number; likes: number }>;

// The grid is 2, 3, 4 or 5 columns wide depending on the screen. A banner goes
// after every ROWS_PER_AD full rows, so its position in the card list differs
// per breakpoint (after card 10 on 2 columns, 15 on 3, 20 on 4, 25 on 5). We
// emit a candidate after every ROWS_PER_AD-th card and show only the ones that
// land on a full-row multiple at the current width, using Tailwind's
// breakpoint display classes (written out literally so Tailwind keeps them).
const ROWS_PER_AD = 5;
const COLUMNS_BY_BREAKPOINT = { base: 2, sm: 3, md: 4, lg: 5 } as const;

function adVisibilityClass(afterCard: number): string {
  const on = (cols: number) => afterCard % (ROWS_PER_AD * cols) === 0;
  return cn(
    on(COLUMNS_BY_BREAKPOINT.base) ? "block" : "hidden",
    on(COLUMNS_BY_BREAKPOINT.sm) ? "sm:block" : "sm:hidden",
    on(COLUMNS_BY_BREAKPOINT.md) ? "md:block" : "md:hidden",
    on(COLUMNS_BY_BREAKPOINT.lg) ? "lg:block" : "lg:hidden"
  );
}

export default function ToolsListClient({ statsMap, adCode }: { statsMap: ToolStatsMap; adCode: string | null }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<ToolCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FREE_TOOLS.filter((tool) => {
      if (category !== "all" && tool.category !== category) return false;
      if (!q) return true;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  const gridClass = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Tools</h1>
        <p className="text-gray-500 mt-1">{FREE_TOOLS.length} tools — search or filter to find what you need</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-violet-400"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setCategory("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
            category === "all" ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
          )}
        >
          All categories
        </button>
        {VISIBLE_CATEGORIES.map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setCategory(key as ToolCategory)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              category === key ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
            )}
          >
            <span>{meta.icon}</span>
            {meta.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No tools match your search.</p>
      ) : (
        <div className={gridClass}>
          {filtered.map((tool, i) => {
            const position = i + 1;
            // Never trail an ad after the very last card.
            const adAfter = adSlotVisible(adCode) && position % ROWS_PER_AD === 0 && position < filtered.length;
            return (
              <Fragment key={tool.id}>
                <ToolCard
                  tool={tool}
                  visits={statsMap[tool.id]?.views ?? 0}
                  likes={statsMap[tool.id]?.likes ?? 0}
                />
                {adAfter && (
                  <div className={cn("col-span-full", adVisibilityClass(position))}>
                    <AdSlot code={adCode} position="middle" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
