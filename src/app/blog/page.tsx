import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, Eye, Heart } from "lucide-react";
import prisma from "@/lib/prisma";
import { extractCoverImage } from "@/lib/markdown";

const metadata: Metadata = {
  title: "Blog — Guides to PDF, Image & Developer Tools",
  description: "Practical guides and how-tos for PDF, image, audio and developer tools, plus product updates from SaaSToolz. Find the fastest way to get things done.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog | SaaSToolz", description: "Practical guides and how-tos for PDF, image, audio and developer tools, plus product updates from SaaSToolz. Find the fastest way to get things done.", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

// Each paginated page is its own canonical URL (page 1 stays /blog).
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const n = Math.floor(Number((await searchParams).page)) || 1;
  return { ...metadata, alternates: { canonical: n > 1 ? `/blog?page=${n}` : "/blog" } };
}

// Posts are published live through /admin/blog with no redeploy — always
// read the current state instead of a build-time snapshot.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const requested = Math.max(1, Math.floor(Number(pageParam)) || 1);
  const total = await prisma.blogPost.count({ where: { published: true } }).catch(() => 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, totalPages);

  // Falls back to the empty state below on a DB hiccup rather than crashing
  // the whole page. Paginated so the index never loads every cover at once.
  const posts = await prisma.blogPost
    .findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { slug: true, title: true, excerpt: true, coverImage: true, publishedAt: true, content: true, views: true, likes: true },
    })
    .catch(() => []);

  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nothing here yet</h1>
        <p className="text-gray-500 mb-8">
          We&apos;re working on guides for getting the most out of SaaSToolz&apos;s
          tools. Check back soon — or see what shipped recently on the{" "}
          <Link href="/changelog" className="text-violet-600 hover:underline">changelog</Link>.
        </p>
        <Link href="/tools" className="inline-block bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors">
          Browse tools instead
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
      <p className="text-gray-500 mb-10">Tips, tool guides and product updates.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const cover = post.coverImage ?? extractCoverImage(post.content);
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-md transition-all"
            >
              <div className="relative aspect-video bg-gradient-to-br from-violet-100 to-fuchsia-100">
                {post.coverImage ? (
                  post.coverImage.startsWith("data:") ? (
                    // Legacy row saved before covers moved to /public/uploads/blog
                    // eslint-disable-next-line @next/next/no-img-element -- base64 data: URL, next/image can't optimize it
                    <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                  )
                ) : cover ? (
                  <Image src={cover} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Newspaper className="w-8 h-8 text-violet-300" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-bold text-gray-900 mb-1 line-clamp-2">{post.title}</h2>
                {post.publishedAt && (
                  <p className="text-xs text-gray-400 mb-2">
                    {post.publishedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
                {post.excerpt && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {totalPages > 1 && (
        <nav aria-label="Blog pages" className="flex items-center justify-between mt-10 text-sm">
          {page > 1 ? (
            <Link href={page === 2 ? "/blog" : `/blog?page=${page - 1}`} rel="prev" className="text-violet-600 hover:underline">← Newer posts</Link>
          ) : <span />}
          <span className="text-gray-400">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={`/blog?page=${page + 1}`} rel="next" className="text-violet-600 hover:underline">Older posts →</Link>
          ) : <span />}
        </nav>
      )}
    </div>
  );
}
