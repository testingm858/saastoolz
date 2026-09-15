import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Eye, Wrench } from "lucide-react";
import { getToolById, FREE_TOOLS, CATEGORY_META } from "@/lib/tools";
import { getToolSeo, RELATED_TOOL_OVERRIDES } from "@/lib/toolSeo";
import { isFileTool } from "@/lib/file-tools";
import { BASE_URL } from "@/lib/site";
import prisma from "@/lib/prisma";
import { getVisitorId } from "@/lib/visitor";
import ToolCard from "@/components/ToolCard";
import ToolInterface from "@/components/ToolInterface";
import FileToolInterface from "@/components/FileToolInterface";
import WebhookTesterClient from "@/components/WebhookTesterClient";
import JsonViewerClient from "@/components/JsonViewerClient";
import InvoiceGeneratorClient from "@/components/invoice/InvoiceGeneratorClient";
import InvoiceGuideContent from "@/components/invoice/InvoiceGuideContent";
import ToolGuideContent from "@/components/tools/ToolGuideContent";
import { TOOL_GUIDES } from "@/lib/toolGuides";
import MetaTagGeneratorClient from "@/components/MetaTagGeneratorClient";
import RobotsTxtGeneratorClient from "@/components/RobotsTxtGeneratorClient";
import AdSlot from "@/components/AdSlot";
import { getAdCodes } from "@/lib/ads";
import { adSlotKey } from "@/lib/adPlacements";
import { canShowAds } from "@/lib/ads/policy";
import LikeButton from "@/components/LikeButton";
import ToolTimeTracker from "@/components/analytics/ToolTimeTracker";
import Link from "next/link";

interface Props {
  params: Promise<{ toolId: string }>;
}

// PRO tools are hidden site-wide — only free tools get a page at all
// (isPremium is still checked below as a hard gate for any tool reached by
// a stale/direct link, e.g. an old bookmark to a Pro tool's URL).
export async function generateStaticParams() {
  return FREE_TOOLS.map((tool) => ({ toolId: tool.id }));
}

// Per-view stats (visits, likes) make this dynamic per request instead of
// statically generated — same tradeoff already made for the blog.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  if (!tool || tool.isPremium) return {};
  const seo = getToolSeo(tool);
  return {
    // `absolute` bypasses the root layout's `"%s | SaaSToolz"` title
    // template — these titles already end in "| SaaSToolz" themselves.
    title: { absolute: seo.title },
    description: seo.metaDescription,
    keywords: tool.tags ?? [],
    alternates: { canonical: `/tools/${tool.id}` },
    openGraph: { title: seo.title, description: seo.metaDescription },
  };
}

export default async function ToolPage({ params }: Props) {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  // PRO tools are fully hidden site-wide — no listing links to them anymore,
  // and any stale/direct link to one 404s instead of showing an upgrade gate.
  if (!tool || tool.isPremium) notFound();

  const catMeta = CATEGORY_META[tool.category];
  const relatedOverrideIds = RELATED_TOOL_OVERRIDES[tool.id];
  const relatedTools = relatedOverrideIds
    ? relatedOverrideIds.map((id) => getToolById(id)).filter((t) => t != null)
    : FREE_TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 6);
  const toolUrl = `${BASE_URL}/tools/${tool.id}`;

  const [stats, usedCount, visitorId] = await Promise.all([
    prisma.toolStats.upsert({
      where: { toolId: tool.id },
      create: { toolId: tool.id, views: 1 },
      update: { views: { increment: 1 } },
    }),
    prisma.toolUsage.count({ where: { toolId: tool.id } }),
    getVisitorId(),
  ]);
  const alreadyLiked = visitorId
    ? (await prisma.like.findUnique({
        where: { targetType_targetId_visitorId: { targetType: "tool", targetId: tool.id, visitorId } },
      })) !== null
    : false;

  const relatedStats = await prisma.toolStats.findMany({
    where: { toolId: { in: relatedTools.map((t) => t.id) } },
    select: { toolId: true, views: true, likes: true },
  });
  const relatedStatsById = new Map(relatedStats.map((s) => [s.toolId, s]));

  const showAds = canShowAds(`/tools/${tool.id}`);
  const adCodes = showAds ? await getAdCodes("tool-action", ["middle", "bottom"]) : {};

  const seo = getToolSeo(tool);
  const { faqs, steps, intro } = seo;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: seo.metaDescription,
        url: toolUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (web-based)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: catMeta?.label ?? tool.category, item: `${BASE_URL}/category/${tool.category}` },
          { "@type": "ListItem", position: 3, name: tool.name, item: toolUrl },
        ],
      },
      // FAQPage only when the same FAQs are actually rendered visibly below —
      // matching Google's guidance against markup for content users can't see.
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ]
        : []),
    ],
  };

  const wide = tool.id === "invoice-generator";

  return (
    <div className={`${wide ? "max-w-7xl" : "max-w-5xl"} mx-auto px-4 py-10`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolTimeTracker toolId={tool.id} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-600">Home</Link>
        <span>/</span>
        <Link href={`/category/${tool.category}`} className="hover:text-gray-600">{catMeta?.label}</Link>
        <span>/</span>
        <span className="text-gray-700">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{tool.description}</p>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-4">
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <Eye className="w-4 h-4" /> {stats.views.toLocaleString()} visits
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-400">
            <Wrench className="w-4 h-4" /> {usedCount.toLocaleString()} uses
          </span>
          <LikeButton targetType="tool" targetId={tool.id} initialLiked={alreadyLiked} initialLikes={stats.likes} />
        </div>
      </div>

      {/* Short explanation of what the tool does */}
      <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl">{intro}</p>

      {tool.id === "webhook-tester" ? (
        <WebhookTesterClient />
      ) : tool.id === "json-viewer" ? (
        <JsonViewerClient />
      ) : tool.id === "invoice-generator" ? (
        <InvoiceGeneratorClient />
      ) : tool.id === "meta-tag-generator" ? (
        <MetaTagGeneratorClient />
      ) : tool.id === "robots-txt" ? (
        <RobotsTxtGeneratorClient />
      ) : isFileTool(tool.id) ? (
        <FileToolInterface tool={tool} />
      ) : (
        /* Tool interface */
        <ToolInterface tool={tool} />
      )}

      {/* Step-by-step usage instructions */}
      {steps.length > 0 && (
        <div className="mt-14 border-t border-gray-100 pt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">How to use {tool.name}</h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Long-form supporting content — reserved for flagship tools, not
          applied to every tool page (see comments in InvoiceGuideContent
          and toolGuides.ts for why). invoice-generator gets a bespoke
          component since its content (invoice vs. receipt, tax invoices)
          doesn't fit the generic section/list/table shape the others share. */}
      {tool.id === "invoice-generator" && <InvoiceGuideContent />}
      {TOOL_GUIDES[tool.id] && <ToolGuideContent guide={TOOL_GUIDES[tool.id]!} />}

      {/* Ad placement — before Related Tools */}
      <AdSlot code={adCodes[adSlotKey("tool-action", "middle")] ?? null} position="middle" />

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {relatedOverrideIds ? "Related SaaSToolz tools" : `Related ${catMeta?.label}`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {relatedTools.map((t) => (
              <ToolCard
                key={t.id}
                tool={t}
                visits={relatedStatsById.get(t.id)?.views ?? 0}
                likes={relatedStatsById.get(t.id)?.likes ?? 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* SEO FAQ — the exact same content is mirrored in the FAQPage schema above */}
      {faqs.length > 0 && (
        <div className="mt-14 border-t border-gray-100 pt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ad placement — after FAQs */}
      <AdSlot code={adCodes[adSlotKey("tool-action", "bottom")] ?? null} position="bottom" />
    </div>
  );
}
