import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import prisma from "@/lib/prisma";
import BlogAdminClient from "./BlogAdminClient";

export const metadata: Metadata = { title: "Blog Admin", robots: { index: false, follow: false } };

export default async function BlogAdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) redirect("/auth/signin?callbackUrl=/admin/blog");
  if (!isAdminEmail(email)) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Not authorized</h1>
        <p className="text-gray-500 text-sm">This page is restricted to admin accounts.</p>
      </div>
    );
  }

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return <BlogAdminClient initialPosts={posts.map((p) => ({ ...p, publishedAt: p.publishedAt?.toISOString() ?? null, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }))} />;
}
