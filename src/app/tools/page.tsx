import type { Metadata } from "next";
import { Suspense } from "react";
import { FREE_TOOLS } from "@/lib/tools";
import prisma from "@/lib/prisma";
import ToolsListClient, { type ToolStatsMap } from "./ToolsListClient";

export const metadata: Metadata = {
  title: `Free Online Tools — ${FREE_TOOLS.length} Tools, No Signup`,
  description: `Browse every free online tool on SaaSToolz — ${FREE_TOOLS.length} PDF, image, developer, calculator, design and writing tools, searchable by name. No signup, no cost.`,
  alternates: { canonical: "/tools" },
  openGraph: {
    title: `Free Online Tools — ${FREE_TOOLS.length} Tools, No Signup | SaaSToolz`,
    description: `Browse every free online tool on SaaSToolz — ${FREE_TOOLS.length} PDF, image, developer, calculator, design and writing tools, searchable by name. No signup, no cost.`,
  },
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
