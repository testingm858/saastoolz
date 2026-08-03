import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import prisma from "@/lib/prisma";
import { getToolById } from "@/lib/tools";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

function formatCountryName(code: string | null): string {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

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

  const [totalRequests, toolCountsRaw, toolSuccessCounts, countryCountsRaw, recentErrors] = await Promise.all([
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
  ]);

  const toolCounts = [...toolCountsRaw].sort((a, b) => b._count - a._count);
  const countryCounts = [...countryCountsRaw].sort((a, b) => b._count - a._count);
  const successByTool = new Map(toolSuccessCounts.map((s) => [s.toolId, s._count]));
  const overallSuccess = toolCounts.reduce((sum, t) => sum + (successByTool.get(t.toolId) ?? 0), 0);
  const uniqueCountries = countryCounts.filter((c) => c.country).length;
  const maxCountryCount = Math.max(1, ...countryCounts.map((c) => c._count));
  const maxToolCount = Math.max(1, ...toolCounts.map((t) => t._count));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-violet-300 transition-colors">
          <Newspaper className="w-3.5 h-3.5" /> Manage blog
        </Link>
      </div>
      <p className="text-gray-500 text-sm mb-8">Tool usage and geographic analytics</p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total requests", value: totalRequests.toLocaleString() },
          { label: "Tools used", value: toolCounts.length.toLocaleString() },
          { label: "Countries reached", value: uniqueCountries.toLocaleString() },
          { label: "Success rate", value: totalRequests > 0 ? `${Math.round((overallSuccess / totalRequests) * 100)}%` : "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{s.label}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tool usage */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Usage by tool</h2>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {toolCounts.length === 0 ? (
            <p className="p-6 text-sm text-gray-400 text-center">No usage recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3">Tool</th>
                  <th className="px-5 py-3">Uses</th>
                  <th className="px-5 py-3">Success</th>
                  <th className="px-5 py-3">Avg latency</th>
                </tr>
              </thead>
              <tbody>
                {toolCounts.map((t) => {
                  const uses = t._count;
                  const successes = successByTool.get(t.toolId) ?? 0;
                  const rate = uses > 0 ? Math.round((successes / uses) * 100) : 0;
                  const tool = getToolById(t.toolId);
                  return (
                    <tr key={t.toolId} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 text-gray-900 font-medium">
                          <span>{tool?.icon ?? "🔧"}</span>
                          <span>{tool?.name ?? t.toolId}</span>
                        </div>
                        <div className="relative h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden max-w-[160px]">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(uses / maxToolCount) * 100}%` }} />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-700 tabular-nums">{uses.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={rate >= 90 ? "text-green-600" : rate >= 60 ? "text-amber-600" : "text-red-600"}>{rate}%</span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 tabular-nums">
                        {t._avg.latencyMs != null ? `${Math.round(t._avg.latencyMs)} ms` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Geographic distribution */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Usage by location</h2>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {countryCounts.length === 0 ? (
            <p className="p-6 text-sm text-gray-400 text-center">No usage recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3">Country</th>
                  <th className="px-5 py-3">Uses</th>
                  <th className="px-5 py-3">Share</th>
                </tr>
              </thead>
              <tbody>
                {countryCounts.map((c) => {
                  const count = c._count;
                  const pct = totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
                  return (
                    <tr key={c.country ?? "unknown"} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-3 text-gray-900 font-medium">{formatCountryName(c.country)}</td>
                      <td className="px-5 py-3 text-gray-700 tabular-nums">{count.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden w-24">
                            <div className="h-full bg-fuchsia-500 rounded-full" style={{ width: `${(count / maxCountryCount) * 100}%` }} />
                          </div>
                          <span className="text-gray-400 text-xs tabular-nums">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Location is derived from Vercel&apos;s edge network — not available for requests made against a local dev server.
        </p>
      </section>

      {/* Recent errors */}
      {recentErrors.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Recent errors</h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3">Tool</th>
                  <th className="px-5 py-3">Error</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">When</th>
                </tr>
              </thead>
              <tbody>
                {recentErrors.map((e, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-900 font-medium whitespace-nowrap">{getToolById(e.toolId)?.name ?? e.toolId}</td>
                    <td className="px-5 py-3 text-gray-500 max-w-xs truncate" title={e.errorMessage ?? ""}>{e.errorMessage ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{e.city ? `${e.city}, ` : ""}{formatCountryName(e.country)}</td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{e.createdAt.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
