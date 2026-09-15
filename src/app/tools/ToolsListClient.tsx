"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { FREE_TOOLS, CATEGORY_META, type ToolCategory } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";
import { cn } from "@/lib/utils";

// PRO tools are hidden site-wide — this page only ever lists FREE_TOOLS, and
// the "ai-*" (Pro) categories are dropped from the category filter below.
// /category/ai-* itself 404s now too, so there's nothing left to link to.
const VISIBLE_CATEGORIES = Object.entries(CATEGORY_META).filter(([key]) => !key.startsWith("ai-"));

export type ToolStatsMap = Record<string, { views: number; likes: number }>;

export default function ToolsListClient({ statsMap }: { statsMap: ToolStatsMap }) {
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
          {filtered.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              visits={statsMap[tool.id]?.views ?? 0}
              likes={statsMap[tool.id]?.likes ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
