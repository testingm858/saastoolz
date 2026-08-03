import type { Metadata } from "next";
import { Suspense } from "react";
import { FREE_TOOLS } from "@/lib/tools";
import ToolsListClient from "./ToolsListClient";

export const metadata: Metadata = {
  title: "All Tools",
  description: `Browse all ${FREE_TOOLS.length} tools on SaaSToolz, searchable by name or category.`,
  alternates: { canonical: "/tools" },
};

export default function AllToolsPage() {
  return (
    <Suspense fallback={null}>
      <ToolsListClient />
    </Suspense>
  );
}
