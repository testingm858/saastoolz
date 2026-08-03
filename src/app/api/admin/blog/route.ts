// GET/POST /api/admin/blog — list and create blog posts. Admin-only.

import { NextResponse } from "next/server";
import { requireAdminEmail } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function GET() {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  if (!(await requireAdminEmail())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : null;
  if (!title || !content) {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 });
  }

  const requestedSlug = typeof body.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(title);
  if (!requestedSlug) {
    return NextResponse.json({ error: "Could not derive a valid slug from the title" }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: requestedSlug } });
  if (existing) {
    return NextResponse.json({ error: `Slug "${requestedSlug}" is already in use` }, { status: 409 });
  }

  const published = body.published === true;
  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: requestedSlug,
      excerpt,
      content,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
