import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, tool guides and product updates from SaaSToolz.",
  alternates: { canonical: "/blog" },
};

// Posts are published live through /admin/blog with no redeploy — always
// read the current state instead of a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, excerpt: true, publishedAt: true },
  });

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
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
      <p className="text-gray-500 mb-10">Tips, tool guides and product updates.</p>
      <div className="space-y-5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-white border border-gray-100 rounded-2xl p-6 hover:border-violet-200 hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h2>
            {post.publishedAt && (
              <p className="text-xs text-gray-400 mb-2">
                {post.publishedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            )}
            {post.excerpt && <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
