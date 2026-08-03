import type { MetadataRoute } from "next";
import { FREE_TOOLS, CATEGORY_META } from "@/lib/tools";
import { BASE_URL } from "@/lib/site";
import prisma from "@/lib/prisma";

// Only free tools/categories are listed — PRO tools and ai-* categories are
// hidden and 404 site-wide, so they have no page worth crawling.
// Revalidate hourly so newly published blog posts show up here without
// needing a redeploy — sitemaps don't need to be real-time, crawlers only
// re-fetch periodically anyway.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/tools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/changelog`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${BASE_URL}/api-docs`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/pricing`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryPages: MetadataRoute.Sitemap = Object.keys(CATEGORY_META)
    .filter((category) => !category.startsWith("ai-"))
    .map((category) => ({
      url: `${BASE_URL}/category/${category}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const toolPages: MetadataRoute.Sitemap = FREE_TOOLS.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const publishedPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
  const blogPages: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages];
}
