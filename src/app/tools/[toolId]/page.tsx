import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolById, FREE_TOOLS, CATEGORY_META } from "@/lib/tools";
import { isFileTool } from "@/lib/file-tools";
import { BASE_URL } from "@/lib/site";
import ToolCard from "@/components/ToolCard";
import ToolInterface from "@/components/ToolInterface";
import FileToolInterface from "@/components/FileToolInterface";
import WebhookTesterClient from "@/components/WebhookTesterClient";
import JsonViewerClient from "@/components/JsonViewerClient";
import AdSlot from "@/components/AdSlot";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  if (!tool || tool.isPremium) return {};
  return {
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    keywords: tool.tags ?? [],
    alternates: { canonical: `/tools/${tool.id}` },
    openGraph: { title: `${tool.name} | SaaSToolz`, description: tool.description },
  };
}

export default async function ToolPage({ params }: Props) {
  const { toolId } = await params;
  const tool = getToolById(toolId);
  // PRO tools are fully hidden site-wide — no listing links to them anymore,
  // and any stale/direct link to one 404s instead of showing an upgrade gate.
  if (!tool || tool.isPremium) notFound();

  const catMeta = CATEGORY_META[tool.category];
  const relatedTools = FREE_TOOLS.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 6);
  const toolUrl = `${BASE_URL}/tools/${tool.id}`;

  const faqs = [
    { q: `Is ${tool.name} free?`, a: "Yes! This tool is completely free with no account required." },
    { q: `Is my data safe when using ${tool.name}?`, a: "Yes. We process files locally in your browser where possible. Files uploaded to our servers are deleted within 1 hour." },
    { q: `What file formats does ${tool.name} support?`, a: "Please refer to the tool interface above for supported formats and options." },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description,
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
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
      </div>

      {tool.id === "webhook-tester" ? (
        <WebhookTesterClient />
      ) : tool.id === "json-viewer" ? (
        <JsonViewerClient />
      ) : isFileTool(tool.id) ? (
        <FileToolInterface tool={tool} />
      ) : (
        /* Tool interface */
        <ToolInterface tool={tool} />
      )}

      {/* Single horizontal ad placement */}
      <AdSlot />

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related {catMeta?.label}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {relatedTools.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        </div>
      )}

      {/* SEO FAQ */}
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
    </div>
  );
}
