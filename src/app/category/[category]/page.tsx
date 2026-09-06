import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolsByCategory, getToolById, CATEGORY_META, ToolCategory } from "@/lib/tools";
import { CATEGORY_CONTENT, CATEGORY_BLOG_SLUGS } from "@/lib/categoryContent";
import { BASE_URL } from "@/lib/site";
import prisma from "@/lib/prisma";
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

// Per-card visit/like stats make this dynamic per request instead of
// statically generated — same tradeoff already made for tool detail pages.
export const dynamic = "force-dynamic";

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
  const content = CATEGORY_CONTENT[category as ToolCategory];
  const blogSlugs = CATEGORY_BLOG_SLUGS[category as ToolCategory] ?? [];

  const [stats, relatedPosts] = await Promise.all([
    prisma.toolStats.findMany({
      where: { toolId: { in: tools.map((t) => t.id) } },
      select: { toolId: true, views: true, likes: true },
    }),
    blogSlugs.length > 0
      ? prisma.blogPost.findMany({
          where: { slug: { in: blogSlugs }, published: true },
          select: { title: true, slug: true, excerpt: true },
        })
      : Promise.resolve([]),
  ]);
  const statsById = new Map(stats.map((s) => [s.toolId, s]));

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
      // FAQPage only when this category has hand-written FAQs actually
      // rendered below — never markup for content users can't see.
      ...(content && content.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: content.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            },
          ]
        : []),
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
          <ToolCard
            key={tool.id}
            tool={tool}
            visits={statsById.get(tool.id)?.views ?? 0}
            likes={statsById.get(tool.id)?.likes ?? 0}
          />
        ))}
      </div>

      {content && (
        <div className="mt-14 max-w-3xl">
          {/* What tasks users can complete + privacy/browser-processing benefits */}
          <div className="prose-none space-y-4 text-gray-600 leading-relaxed mb-10">
            {content.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Which tool to choose for each task */}
          <h2 className="text-lg font-bold text-gray-900 mb-4">Which tool should I use?</h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-10">
            {content.taskGuide.map((item, i) => {
              const tool = getToolById(item.toolId);
              if (!tool) return null;
              return (
                <Link
                  key={item.toolId}
                  href={`/tools/${item.toolId}`}
                  className={`flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i > 0 ? "border-t border-gray-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm text-gray-700">{item.task}</span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-violet-600 whitespace-nowrap">
                    {tool.name} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Privacy / browser-processing benefits */}
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 mb-10">
            <h2 className="text-sm font-bold text-violet-900 mb-1.5">Your files, handled carefully</h2>
            <p className="text-sm text-violet-800 leading-relaxed">{content.privacyNote}</p>
          </div>

          {/* Short FAQ */}
          {content.faqs.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                    <p className="text-gray-500 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Links to related blog guides */}
      {relatedPosts.length > 0 && (
        <div className="mt-4 max-w-3xl mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Related guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-white border border-gray-100 rounded-xl p-5 hover:border-violet-300 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{post.title}</h3>
                {post.excerpt && <p className="text-gray-500 text-xs leading-relaxed">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
