import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import prisma from "@/lib/prisma";
import { getToolById } from "@/lib/tools";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function formatCountryName(code: string | null): string {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

const PAGE_VIEW_HISTORY_DAYS = 14;

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) redirect("/auth/signin?callbackUrl=/admin");
  if (!isAdminEmail(email)) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Not authorized</h1>
        <p className="text-gray-500 text-sm">This page is restricted to admin accounts.</p>
      </div>
    );
  }

  const [
    totalRequests,
    toolCountsRaw,
    toolSuccessCounts,
    countryCountsRaw,
    recentErrors,
    toolStats,
    blogPosts,
    toolVisitDurations,
    totalPageViews,
    uniqueVisitorsResult,
    pagePathCountsRaw,
    dailyPageViewsRaw,
    totalUsers,
    totalInvoices,
    totalCompanies,
    recentInvoices,
    companiesRaw,
  ] = await Promise.all([
    prisma.toolUsage.count(),
    // `_count: true` (not `{ fieldName: true }`) gives the total row count
    // per group as a plain number — `_count: { fieldName: true }` instead
    // counts only *non-null* occurrences of that specific field, which
    // silently reports 0 for the null/"Unknown" country group below. Sorted
    // in JS since Prisma's groupBy orderBy can't target a plain `_count`.
    prisma.toolUsage.groupBy({
      by: ["toolId"],
      _count: true,
      _avg: { latencyMs: true },
    }),
    prisma.toolUsage.groupBy({
      by: ["toolId"],
      where: { success: true },
      _count: true,
    }),
    prisma.toolUsage.groupBy({
      by: ["country"],
      _count: true,
    }),
    prisma.toolUsage.findMany({
      where: { success: false },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { toolId: true, errorMessage: true, createdAt: true, country: true, city: true },
    }),
    prisma.toolStats.findMany({ orderBy: { views: "desc" }, take: 10 }),
    prisma.blogPost.findMany({
      orderBy: { views: "desc" },
      take: 10,
      select: { title: true, slug: true, views: true, likes: true, published: true },
    }),
    prisma.toolVisit.groupBy({
      by: ["toolId"],
      where: { durationMs: { not: null } },
      _avg: { durationMs: true },
      _count: true,
    }),
    prisma.pageView.count(),
    prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(DISTINCT COALESCE("userId", "visitorId")) as count FROM page_views WHERE "userId" IS NOT NULL OR "visitorId" IS NOT NULL`,
    prisma.pageView.groupBy({ by: ["path"], _count: true }),
    prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT date_trunc('day', "createdAt") as day, COUNT(*)::bigint as count
      FROM page_views
      WHERE "createdAt" >= NOW() - (${PAGE_VIEW_HISTORY_DAYS} * INTERVAL '1 day')
      GROUP BY day
      ORDER BY day ASC
    `,
    prisma.user.count(),
    prisma.invoice.count(),
    prisma.company.count(),
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { company: { select: { name: true, email: true, vatNumber: true } } },
    }),
    prisma.company.findMany({
      include: { _count: { select: { invoices: true } } },
    }),
  ]);

  const toolCounts = [...toolCountsRaw].sort((a, b) => b._count - a._count);
  const countryCounts = [...countryCountsRaw].sort((a, b) => b._count - a._count);
  const successByTool = new Map(toolSuccessCounts.map((s) => [s.toolId, s._count]));
  const usesByTool = new Map(toolCounts.map((t) => [t.toolId, t._count]));
  const overallSuccess = toolCounts.reduce((sum, t) => sum + (successByTool.get(t.toolId) ?? 0), 0);
  const uniqueCountries = countryCounts.filter((c) => c.country).length;
  const maxCountryCount = Math.max(1, ...countryCounts.map((c) => c._count));
  const maxToolCount = Math.max(1, ...toolCounts.map((t) => t._count));
  const avgDurationByTool = new Map(toolVisitDurations.map((t) => [t.toolId, { avgMs: t._avg.durationMs ?? 0, sessions: t._count }]));
  const uniqueVisitors = Number(uniqueVisitorsResult[0]?.count ?? 0);
  const pagePathCounts = [...pagePathCountsRaw].sort((a, b) => b._count - a._count).slice(0, 12);
  const companies = [...companiesRaw].sort((a, b) => b._count.invoices - a._count.invoices);

  const toolUsageChartData = toolCounts.slice(0, 10).map((t) => ({
    name: getToolById(t.toolId)?.name ?? t.toolId,
    Uses: t._count,
  }));
  const locationChartData = countryCounts.slice(0, 10).map((c) => ({
    name: formatCountryName(c.country),
    Uses: c._count,
  }));
  const toolEngagementChartData = toolStats.map((s) => ({
    name: getToolById(s.toolId)?.name ?? s.toolId,
    Visits: s.views,
    Likes: s.likes,
  }));
  const blogChartData = blogPosts.map((p) => ({
    name: p.title.length > 24 ? `${p.title.slice(0, 24)}…` : p.title,
    Reads: p.views,
    Likes: p.likes,
  }));
  const dailyPageViewsChartData = dailyPageViewsRaw.map((d) => ({
    name: new Date(d.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    Views: Number(d.count),
  }));
  const topPagesChartData = pagePathCounts.slice(0, 8).map((p) => ({
    name: p.path.length > 20 ? `${p.path.slice(0, 20)}…` : p.path || "/",
    Views: p._count,
  }));

  const toolTable = toolCounts.map((t) => {
    const tool = getToolById(t.toolId);
    const uses = t._count;
    const successes = successByTool.get(t.toolId) ?? 0;
    const duration = avgDurationByTool.get(t.toolId);
    return {
      toolId: t.toolId,
      name: tool?.name ?? t.toolId,
      icon: tool?.icon ?? "🔧",
      uses,
      successRate: uses > 0 ? Math.round((successes / uses) * 100) : 0,
      avgLatencyMs: t._avg.latencyMs,
      avgDurationMs: duration?.avgMs ?? null,
      durationSessions: duration?.sessions ?? 0,
      barPct: (uses / maxToolCount) * 100,
    };
  });

  const invoiceRows = recentInvoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    companyName: inv.company.name,
    companyEmail: inv.company.email,
    companyVat: inv.company.vatNumber,
    customerName: inv.customerName,
    customerCompany: inv.customerCompany,
    customerEmail: inv.customerEmail,
    currency: inv.currency,
    total: inv.total,
    createdAt: inv.createdAt.toISOString(),
  }));

  const companyRows = companies.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    vatNumber: c.vatNumber,
    invoiceCount: c._count.invoices,
  }));

  const countryRows = countryCounts.map((c) => ({
    country: formatCountryName(c.country),
    count: c._count,
    pct: totalRequests > 0 ? Math.round((c._count / totalRequests) * 100) : 0,
    barPct: (c._count / maxCountryCount) * 100,
  }));

  const errorRows = recentErrors.map((e) => ({
    tool: getToolById(e.toolId)?.name ?? e.toolId,
    error: e.errorMessage,
    location: e.city ? `${e.city}, ${formatCountryName(e.country)}` : formatCountryName(e.country),
    when: e.createdAt.toISOString(),
  }));

  const toolStatsRows = toolStats.map((s) => ({
    toolId: s.toolId,
    name: getToolById(s.toolId)?.name ?? s.toolId,
    icon: getToolById(s.toolId)?.icon ?? "🔧",
    views: s.views,
    uses: usesByTool.get(s.toolId) ?? 0,
    likes: s.likes,
  }));

  const blogRows = blogPosts.map((p) => ({
    title: p.title,
    slug: p.slug,
    views: p.views,
    likes: p.likes,
    published: p.published,
  }));

  return (
    <AdminDashboardClient
      overview={{
        totalRequests,
        toolsUsedCount: toolCounts.length,
        uniqueCountries,
        successRate: totalRequests > 0 ? Math.round((overallSuccess / totalRequests) * 100) : null,
        totalUsers,
        totalPageViews,
        uniqueVisitors,
        totalInvoices,
        totalCompanies,
      }}
      toolUsageChartData={toolUsageChartData}
      toolTable={toolTable}
      locationChartData={locationChartData}
      countryRows={countryRows}
      toolEngagementChartData={toolEngagementChartData}
      toolStatsRows={toolStatsRows}
      blogChartData={blogChartData}
      blogRows={blogRows}
      errorRows={errorRows}
      dailyPageViewsChartData={dailyPageViewsChartData}
      topPagesChartData={topPagesChartData}
      pagePathCounts={pagePathCounts.map((p) => ({ path: p.path || "/", count: p._count }))}
      invoiceRows={invoiceRows}
      companyRows={companyRows}
    />
  );
}
