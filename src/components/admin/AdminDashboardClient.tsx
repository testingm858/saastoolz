"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Wrench,
  Globe2,
  Receipt,
  Newspaper,
  AlertTriangle,
  Megaphone,
  Sparkles,
  Clock,
} from "lucide-react";
import AnalyticsBarChart from "./AnalyticsBarChart";

// ─── Shared row/data shapes (mirrors what src/app/admin/page.tsx computes) ────

interface OverviewData {
  totalRequests: number;
  toolsUsedCount: number;
  uniqueCountries: number;
  successRate: number | null;
  totalUsers: number;
  totalPageViews: number;
  uniqueVisitors: number;
  totalInvoices: number;
  totalCompanies: number;
}

interface ToolTableRow {
  toolId: string;
  name: string;
  icon: string;
  uses: number;
  successRate: number;
  avgLatencyMs: number | null;
  avgDurationMs: number | null;
  durationSessions: number;
  barPct: number;
}

interface CountryRow {
  country: string;
  count: number;
  pct: number;
  barPct: number;
}

interface ToolStatsRow {
  toolId: string;
  name: string;
  icon: string;
  views: number;
  uses: number;
  likes: number;
}

interface BlogRow {
  title: string;
  slug: string;
  views: number;
  likes: number;
  published: boolean;
}

interface ErrorRow {
  tool: string;
  error: string | null;
  location: string;
  when: string;
}

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  companyName: string;
  companyEmail: string | null;
  companyVat: string | null;
  customerName: string | null;
  customerCompany: string | null;
  customerEmail: string | null;
  currency: string;
  total: number | null;
  createdAt: string;
}

interface CompanyRow {
  id: string;
  name: string;
  email: string | null;
  vatNumber: string | null;
  invoiceCount: number;
}

interface ChartDatum {
  name: string;
  [key: string]: string | number;
}

interface Props {
  overview: OverviewData;
  toolUsageChartData: ChartDatum[];
  toolTable: ToolTableRow[];
  locationChartData: ChartDatum[];
  countryRows: CountryRow[];
  toolEngagementChartData: ChartDatum[];
  toolStatsRows: ToolStatsRow[];
  blogChartData: ChartDatum[];
  blogRows: BlogRow[];
  errorRows: ErrorRow[];
  dailyPageViewsChartData: ChartDatum[];
  topPagesChartData: ChartDatum[];
  pagePathCounts: { path: string; count: number }[];
  invoiceRows: InvoiceRow[];
  companyRows: CompanyRow[];
}

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tools", label: "Tools & Usage", icon: Wrench },
  { id: "visitors", label: "Visitors", icon: Globe2 },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "content", label: "Content", icon: Newspaper },
  { id: "system", label: "System", icon: AlertTriangle },
] as const;

type TabId = (typeof TABS)[number]["id"];

function formatDuration(ms: number | null): string {
  if (ms == null || ms <= 0) return "—";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-0.5">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mb-3">{subtitle}</p>}
      {!subtitle && <div className="mb-3" />}
      {children}
    </section>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }) {
  return <p className="p-6 text-sm text-gray-400 text-center">{children}</p>;
}

export default function AdminDashboardClient(props: Props) {
  const [tab, setTab] = useState<TabId>("overview");
  const {
    overview,
    toolUsageChartData,
    toolTable,
    locationChartData,
    countryRows,
    toolEngagementChartData,
    toolStatsRows,
    blogChartData,
    blogRows,
    errorRows,
    dailyPageViewsChartData,
    topPagesChartData,
    pagePathCounts,
    invoiceRows,
    companyRows,
  } = props;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin/ads" className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-violet-300 transition-colors">
            <Megaphone className="w-3.5 h-3.5" /> Manage ads
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-violet-300 transition-colors">
            <Newspaper className="w-3.5 h-3.5" /> Manage blog
          </Link>
          <Link href="/admin/announcements" className="flex items-center gap-1.5 text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-violet-300 transition-colors">
            <Sparkles className="w-3.5 h-3.5" /> Announcements
          </Link>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6">Tool usage, visitors, invoices and content — all in one place.</p>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                active
                  ? "border-violet-600 text-violet-700"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
              {t.id === "system" && errorRows.length > 0 && (
                <span className="ml-1 text-[10px] font-bold bg-red-100 text-red-600 rounded-full px-1.5 py-0.5">{errorRows.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "overview" && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total requests" value={overview.totalRequests.toLocaleString()} />
            <StatCard label="Tools used" value={overview.toolsUsedCount.toLocaleString()} />
            <StatCard label="Success rate" value={overview.successRate != null ? `${overview.successRate}%` : "—"} />
            <StatCard label="Countries reached" value={overview.uniqueCountries.toLocaleString()} />
            <StatCard label="Page views" value={overview.totalPageViews.toLocaleString()} />
            <StatCard label="Unique visitors" value={overview.uniqueVisitors.toLocaleString()} hint="cookie + signed-in, deduped" />
            <StatCard label="Signed-up users" value={overview.totalUsers.toLocaleString()} />
            <StatCard label="Invoices generated" value={overview.totalInvoices.toLocaleString()} hint={`${overview.totalCompanies.toLocaleString()} companies`} />
          </div>

          <Card title="Requests by tool">
            {toolUsageChartData.length > 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <AnalyticsBarChart data={toolUsageChartData} xKey="name" bars={[{ key: "Uses", color: "#7c3aed", label: "Uses" }]} />
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl"><EmptyRow>No usage recorded yet.</EmptyRow></div>
            )}
          </Card>

          <Card title="Page views — last 14 days">
            {dailyPageViewsChartData.length > 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <AnalyticsBarChart data={dailyPageViewsChartData} xKey="name" bars={[{ key: "Views", color: "#0ea5e9", label: "Views" }]} />
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl"><EmptyRow>No page views recorded yet.</EmptyRow></div>
            )}
          </Card>
        </div>
      )}

      {tab === "tools" && (
        <div>
          <Card title="Usage by tool" subtitle="Requests, success rate, average processing time, and average time visitors spend on the page.">
            {toolUsageChartData.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
                <AnalyticsBarChart data={toolUsageChartData} xKey="name" bars={[{ key: "Uses", color: "#7c3aed", label: "Uses" }]} />
              </div>
            )}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
              {toolTable.length === 0 ? (
                <EmptyRow>No usage recorded yet.</EmptyRow>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      <th className="px-5 py-3">Tool</th>
                      <th className="px-5 py-3">Uses</th>
                      <th className="px-5 py-3">Success</th>
                      <th className="px-5 py-3">Avg latency</th>
                      <th className="px-5 py-3">Avg time on tool</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toolTable.map((t) => (
                      <tr key={t.toolId} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 text-gray-900 font-medium">
                            <span>{t.icon}</span>
                            <span>{t.name}</span>
                          </div>
                          <div className="relative h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden max-w-[160px]">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${t.barPct}%` }} />
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{t.uses.toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <span className={t.successRate >= 90 ? "text-green-600" : t.successRate >= 60 ? "text-amber-600" : "text-red-600"}>{t.successRate}%</span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 tabular-nums">
                          {t.avgLatencyMs != null ? `${Math.round(t.avgLatencyMs)} ms` : "—"}
                        </td>
                        <td className="px-5 py-3 text-gray-500 tabular-nums">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-300" />
                            {formatDuration(t.avgDurationMs)}
                            {t.durationSessions > 0 && <span className="text-gray-300">· {t.durationSessions.toLocaleString()} sessions</span>}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          <Card title="Tool engagement — visits &amp; likes">
            {toolEngagementChartData.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
                <AnalyticsBarChart
                  data={toolEngagementChartData}
                  xKey="name"
                  bars={[
                    { key: "Visits", color: "#7c3aed", label: "Visits" },
                    { key: "Likes", color: "#ef4444", label: "Likes" },
                  ]}
                />
              </div>
            )}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {toolStatsRows.length === 0 ? (
                <EmptyRow>No tool page visits recorded yet.</EmptyRow>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      <th className="px-5 py-3">Tool</th>
                      <th className="px-5 py-3">Visits</th>
                      <th className="px-5 py-3">Uses</th>
                      <th className="px-5 py-3">Likes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toolStatsRows.map((s) => (
                      <tr key={s.toolId} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 text-gray-900 font-medium">
                            <span>{s.icon}</span>
                            <span>{s.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{s.views.toLocaleString()}</td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{s.uses.toLocaleString()}</td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{s.likes.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      )}

      {tab === "visitors" && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Page views" value={overview.totalPageViews.toLocaleString()} />
            <StatCard label="Unique visitors" value={overview.uniqueVisitors.toLocaleString()} />
            <StatCard label="Signed-up users" value={overview.totalUsers.toLocaleString()} />
            <StatCard label="Countries reached" value={overview.uniqueCountries.toLocaleString()} />
          </div>

          <Card title="Page views — last 14 days">
            {dailyPageViewsChartData.length > 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <AnalyticsBarChart data={dailyPageViewsChartData} xKey="name" bars={[{ key: "Views", color: "#0ea5e9", label: "Views" }]} />
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl"><EmptyRow>No page views recorded yet.</EmptyRow></div>
            )}
          </Card>

          <Card title="Most visited pages">
            {topPagesChartData.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
                <AnalyticsBarChart data={topPagesChartData} xKey="name" bars={[{ key: "Views", color: "#7c3aed", label: "Views" }]} />
              </div>
            )}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {pagePathCounts.length === 0 ? (
                <EmptyRow>No page views recorded yet.</EmptyRow>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      <th className="px-5 py-3">Path</th>
                      <th className="px-5 py-3">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagePathCounts.map((p) => (
                      <tr key={p.path} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-gray-900 font-medium font-mono text-xs">{p.path}</td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{p.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          <Card title="Usage by location">
            {locationChartData.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
                <AnalyticsBarChart data={locationChartData} xKey="name" bars={[{ key: "Uses", color: "#d946ef", label: "Uses" }]} />
              </div>
            )}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {countryRows.length === 0 ? (
                <EmptyRow>No usage recorded yet.</EmptyRow>
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
                    {countryRows.map((c) => (
                      <tr key={c.country} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-gray-900 font-medium">{c.country}</td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{c.count.toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden w-24">
                              <div className="h-full bg-fuchsia-500 rounded-full" style={{ width: `${c.barPct}%` }} />
                            </div>
                            <span className="text-gray-400 text-xs tabular-nums">{c.pct}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Location is derived from Vercel&apos;s edge network — not available for requests made against a local dev server.
            </p>
          </Card>
        </div>
      )}

      {tab === "invoices" && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Invoices generated" value={overview.totalInvoices.toLocaleString()} />
            <StatCard label="Companies" value={overview.totalCompanies.toLocaleString()} />
          </div>

          <Card title="Companies" subtitle="Every company that has generated an invoice, with contact + VAT details captured from the editor.">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
              {companyRows.length === 0 ? (
                <EmptyRow>No invoices generated yet.</EmptyRow>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      <th className="px-5 py-3">Company</th>
                      <th className="px-5 py-3">Email</th>
                      <th className="px-5 py-3">VAT number</th>
                      <th className="px-5 py-3">Invoices generated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyRows.map((c) => (
                      <tr key={c.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-gray-900 font-medium whitespace-nowrap">{c.name}</td>
                        <td className="px-5 py-3 text-gray-500">{c.email || "—"}</td>
                        <td className="px-5 py-3 text-gray-500 font-mono text-xs">{c.vatNumber ?? "—"}</td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums font-semibold">{c.invoiceCount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          <Card title="Recent invoices" subtitle="Latest 50 invoices, with the customer they were billed to and the company that issued them.">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
              {invoiceRows.length === 0 ? (
                <EmptyRow>No invoices generated yet.</EmptyRow>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      <th className="px-5 py-3">Invoice #</th>
                      <th className="px-5 py-3">Company</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Customer company</th>
                      <th className="px-5 py-3">Customer email</th>
                      <th className="px-5 py-3">Total</th>
                      <th className="px-5 py-3">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceRows.map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-gray-900 font-medium font-mono text-xs whitespace-nowrap">{inv.invoiceNumber}</td>
                        <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{inv.companyName}</td>
                        <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{inv.customerName ?? "—"}</td>
                        <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{inv.customerCompany ?? "—"}</td>
                        <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{inv.customerEmail ?? "—"}</td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums whitespace-nowrap">
                          {inv.total != null ? `${inv.currency} ${inv.total.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{new Date(inv.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      )}

      {tab === "content" && (
        <div>
          <Card title="Blog performance">
            {blogChartData.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
                <AnalyticsBarChart
                  data={blogChartData}
                  xKey="name"
                  bars={[
                    { key: "Reads", color: "#7c3aed", label: "Reads" },
                    { key: "Likes", color: "#ef4444", label: "Likes" },
                  ]}
                />
              </div>
            )}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {blogRows.length === 0 ? (
                <EmptyRow>No blog posts yet.</EmptyRow>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      <th className="px-5 py-3">Post</th>
                      <th className="px-5 py-3">Reads</th>
                      <th className="px-5 py-3">Likes</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogRows.map((p) => (
                      <tr key={p.slug} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3">
                          <Link href={`/blog/${p.slug}`} className="text-gray-900 font-medium hover:text-violet-600 transition-colors">
                            {p.title}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{p.views.toLocaleString()}</td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{p.likes.toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <span className={p.published ? "text-green-600" : "text-gray-400"}>
                            {p.published ? "Published" : "Draft"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          <Card title="Tool engagement — visits &amp; likes">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {toolStatsRows.length === 0 ? (
                <EmptyRow>No tool page visits recorded yet.</EmptyRow>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      <th className="px-5 py-3">Tool</th>
                      <th className="px-5 py-3">Visits</th>
                      <th className="px-5 py-3">Likes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {toolStatsRows.map((s) => (
                      <tr key={s.toolId} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 text-gray-900 font-medium">
                            <span>{s.icon}</span>
                            <span>{s.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{s.views.toLocaleString()}</td>
                        <td className="px-5 py-3 text-gray-700 tabular-nums">{s.likes.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      )}

      {tab === "system" && (
        <div>
          <Card title="Recent errors">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              {errorRows.length === 0 ? (
                <EmptyRow>No errors recorded. 🎉</EmptyRow>
              ) : (
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
                    {errorRows.map((e, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="px-5 py-3 text-gray-900 font-medium whitespace-nowrap">{e.tool}</td>
                        <td className="px-5 py-3 text-gray-500 max-w-xs truncate" title={e.error ?? ""}>{e.error ?? "—"}</td>
                        <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{e.location}</td>
                        <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{new Date(e.when).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
