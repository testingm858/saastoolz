import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolsByCategory, CATEGORY_META, ToolCategory } from "@/lib/tools";
import { BASE_URL } from "@/lib/site";
import ToolCard from "@/components/ToolCard";

interface Props {
  params: Promise<{ category: string }>;
}

// PRO (ai-*) categories are hidden site-wide — only free categories get a
// page at all; a stale/direct link to one 404s below.
export async function generateStaticParams() {
  return Object.keys(CATEGORY_META)
    .filter((category) => !category.startsWith("ai-"))
    .map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta || category.startsWith("ai-")) return {};
  return {
    title: `${meta.label} — Free Online Tools`,
    description: meta.description,
    alternates: { canonical: `/category/${category}` },
    openGraph: { title: `${meta.label} | SaaSToolz`, description: meta.description },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  // PRO (ai-*) categories are hidden site-wide — no listing links here
  // anymore, and a stale/direct link 404s instead of showing them.
  if (!meta || category.startsWith("ai-")) notFound();

  const tools = getToolsByCategory(category as ToolCategory);
  const categoryUrl = `${BASE_URL}/category/${category}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: meta.label,
        description: meta.description,
        url: categoryUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: meta.label, item: categoryUrl },
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-5xl">{meta.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{meta.label}</h1>
            <p className="text-gray-500 mt-1">{meta.description}</p>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-2">{tools.length} tools in this category</p>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
