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

// Bump this to today whenever the shared site chrome, nav, or copy on the
// static/category/tool pages actually changes. These pages are static code,
// not DB rows, so there's no real per-page "last changed" timestamp to read
// — but reusing `new Date()` on every hourly `revalidate` (as this file
// previously did) told crawlers every page changes every hour, which is a
// false freshness signal, not an accurate one. A manually-bumped constant is
// honest: it says "unchanged since this date," which stays true until
// someone remembers to bump it.
const CONTENT_LAST_UPDATED = new Date("2026-11-06T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = CONTENT_LAST_UPDATED;

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE_URL}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${BASE_URL}/api-docs`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryPages: MetadataRoute.Sitemap = Object.keys(CATEGORY_META)
    .filter((category) => !category.startsWith("ai-"))
    .map((category) => ({
      url: `${BASE_URL}/category/${category}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // Recently new/updated tools (see FREE_TOOLS' isNew/isUpdated flags) get a
  // priority and crawl-frequency bump — a direct, honest signal to re-crawl
  // pages whose content just materially changed, rather than treating a
  // freshly-rebuilt tool the same as one that's been stable for a year.
  const toolPages: MetadataRoute.Sitemap = FREE_TOOLS.map((tool) => {
    const recentlyChanged = tool.isNew || tool.isUpdated;
    return {
      url: `${BASE_URL}/tools/${tool.id}`,
      lastModified: recentlyChanged ? new Date() : now,
      changeFrequency: recentlyChanged ? "weekly" : "monthly",
      priority: recentlyChanged ? 0.8 : 0.7,
    };
  });

  // A DB hiccup should drop blog posts from the sitemap, not the whole thing.
  const publishedPosts = await prisma.blogPost
    .findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })
    .catch(() => []);
  const blogPages: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages];
}
