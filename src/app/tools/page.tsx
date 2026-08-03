import type { Metadata } from "next";
import { Suspense } from "react";
import { FREE_TOOLS } from "@/lib/tools";
import prisma from "@/lib/prisma";
import ToolsListClient, { type ToolStatsMap } from "./ToolsListClient";

export const metadata: Metadata = {
  title: "All Tools",
  description: `Browse all ${FREE_TOOLS.length} tools on SaaSToolz, searchable by name or category.`,
  alternates: { canonical: "/tools" },
};

// Per-card visit/like stats make this dynamic per request instead of
// statically generated — same tradeoff already made elsewhere for stats.
export const dynamic = "force-dynamic";

export default async function AllToolsPage() {
  const stats = await prisma.toolStats.findMany({
    where: { toolId: { in: FREE_TOOLS.map((t) => t.id) } },
    select: { toolId: true, views: true, likes: true },
  });
  const statsMap: ToolStatsMap = Object.fromEntries(
    stats.map((s) => [s.toolId, { views: s.views, likes: s.likes }])
  );

  return (
    <Suspense fallback={null}>
      <ToolsListClient statsMap={statsMap} />
    </Suspense>
  );
}
