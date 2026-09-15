import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import prisma from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";
import { BASE_URL } from "@/lib/site";
import { getVisitorId } from "@/lib/visitor";
import LikeButton from "@/components/LikeButton";
import AdSlot from "@/components/AdSlot";
import { getAdCodes } from "@/lib/ads";
import { adSlotKey } from "@/lib/adPlacements";
import { canShowAds } from "@/lib/ads/policy";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt ?? undefined, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const [, visitorId] = await Promise.all([
    prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } }),
    getVisitorId(),
  ]);
  const alreadyLiked = visitorId
    ? (await prisma.like.findUnique({
        where: { targetType_targetId_visitorId: { targetType: "blog", targetId: slug, visitorId } },
      })) !== null
    : false;

  const html = renderMarkdown(post.content);
  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  const adCodes = canShowAds(`/blog/${post.slug}`) ? await getAdCodes("blog-post", ["middle", "bottom"]) : {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: postUrl,
    image: post.coverImage ?? `${postUrl}/opengraph-image`,
    author: { "@type": "Organization", name: "SaaSToolz" },
    publisher: { "@type": "Organization", name: "SaaSToolz", logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.jpeg` } },
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/blog" className="flex items-center gap-1.5 text-sm text-violet-600 hover:underline mb-8">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
      <div className="flex items-center flex-wrap gap-4 mb-10">
        {post.publishedAt && (
          <p className="text-sm text-gray-400">
            {post.publishedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
        <span className="flex items-center gap-1.5 text-sm text-gray-400">
          <Eye className="w-4 h-4" /> {(post.views + 1).toLocaleString()} reads
        </span>
        <LikeButton targetType="blog" targetId={slug} initialLiked={alreadyLiked} initialLikes={post.likes} />
      </div>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element -- data: URL, not a static asset next/image can optimize
        <img src={post.coverImage} alt={post.title} className="w-full aspect-video object-cover rounded-2xl mb-10" />
      )}

      <AdSlot code={adCodes[adSlotKey("blog-post", "middle")] ?? null} position="middle" />

      <div
        className="text-gray-700
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-8 [&_h1]:mb-4
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3
          [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-2
          [&_p]:leading-relaxed [&_p]:mb-4
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1
          [&_a]:text-violet-600 [&_a]:hover:underline
          [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:mb-4
          [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
          [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_pre]:text-sm
          [&_img]:rounded-xl [&_img]:mb-4 [&_img]:max-w-full
          [&_hr]:border-gray-100 [&_hr]:my-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <AdSlot code={adCodes[adSlotKey("blog-post", "bottom")] ?? null} position="bottom" />
    </div>
  );
}
